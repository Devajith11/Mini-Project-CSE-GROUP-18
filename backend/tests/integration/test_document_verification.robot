*** Settings ***
Documentation       Integration Tests — Document Verification Workflow
Resource            ../resources/common.resource
Suite Setup         Run Keywords    Create API Session    AND    Setup Document Test Actors
Suite Teardown      Delete All Sessions

*** Variables ***
${DOC_KEAM}         INT_DOC_001
${DOC_PASS}         DocPass@2024
${DOC_STU_TOK}      ${EMPTY}
${DOC_STU_ID}       ${EMPTY}
${DOC_ADM_TOK}      ${EMPTY}
${DOC_ID_1}         ${EMPTY}
${DOC_ID_2}         ${EMPTY}

*** Keywords ***
Setup Document Test Actors
    &{reg}=    Create Dictionary    keamAppNumber=${DOC_KEAM}    password=${DOC_PASS}
    POST On Session    gecw_api    /api/auth/register    json=${reg}    expected_status=any
    &{login}=    Create Dictionary    keamAppNumber=${DOC_KEAM}    password=${DOC_PASS}
    ${resp}=    POST On Session    gecw_api    /api/auth/login    json=${login}
    Set Suite Variable    ${DOC_STU_TOK}    ${resp.json()}[token]
    Set Suite Variable    ${DOC_STU_ID}     ${resp.json()}[student][_id]
    &{admin_login}=    Create Dictionary    username=admin_gecw    password=admin123
    ${aresp}=    POST On Session    gecw_api    /api/auth/admin/login    json=${admin_login}
    Set Suite Variable    ${DOC_ADM_TOK}    ${aresp.json()}[token]

*** Test Cases ***

TC-DOC-001: Student Uploads Two Documents (Both Default Pending)
    [Tags]    integration    documents
    &{headers}=    Create Dictionary    Authorization=Bearer ${DOC_STU_TOK}
    ${files1}=    Create Dictionary    document=${{ ("allotment_memo.pdf", b"MOCK ALLOTMENT MEMO", "application/pdf") }}
    &{data1}=    Create Dictionary    name=Allotment Memo
    ${resp1}=    POST On Session    gecw_api    /api/student/upload
    ...    files=${files1}    data=${data1}    headers=${headers}
    Should Be Equal As Integers    ${resp1.status_code}    200
    ${docs1}=    Set Variable    ${resp1.json()}[documents]
    ${last1}=    Set Variable    ${docs1[-1]}
    Set Suite Variable    ${DOC_ID_1}    ${last1}[_id]
    Should Be Equal    ${last1}[status]    Pending
    ${files2}=    Create Dictionary    document=${{ ("tc_certificate.pdf", b"MOCK TC CONTENT", "application/pdf") }}
    &{data2}=    Create Dictionary    name=Transfer Certificate
    ${resp2}=    POST On Session    gecw_api    /api/student/upload
    ...    files=${files2}    data=${data2}    headers=${headers}
    Should Be Equal As Integers    ${resp2.status_code}    200
    ${docs2}=    Set Variable    ${resp2.json()}[documents]
    ${last2}=    Set Variable    ${docs2[-1]}
    Set Suite Variable    ${DOC_ID_2}    ${last2}[_id]
    Should Be Equal    ${last2}[status]    Pending

TC-DOC-002: Admin Verifies First And Rejects Second Document
    [Tags]    integration    documents
    &{headers}=    Create Dictionary    Authorization=Bearer ${DOC_ADM_TOK}
    &{body1}=    Create Dictionary
    ...    studentId=${DOC_STU_ID}    documentId=${DOC_ID_1}    status=Verified
    ${resp1}=    POST On Session    gecw_api    /api/admin/verify    json=${body1}    headers=${headers}
    Should Be Equal As Integers    ${resp1.status_code}    200
    &{body2}=    Create Dictionary
    ...    studentId=${DOC_STU_ID}    documentId=${DOC_ID_2}    status=Rejected
    ...    adminFeedback=Document is blurry. Please re-upload a clear scan.
    ${resp2}=    POST On Session    gecw_api    /api/admin/verify    json=${body2}    headers=${headers}
    Should Be Equal As Integers    ${resp2.status_code}    200

TC-DOC-003: Student Sees Correct Document Statuses
    [Tags]    integration    documents
    &{headers}=    Create Dictionary    Authorization=Bearer ${DOC_STU_TOK}
    ${resp}=    GET On Session    gecw_api    /api/student/profile    headers=${headers}
    Should Be Equal As Integers    ${resp.status_code}    200
    FOR    ${doc}    IN    @{resp.json()}[documents]
        IF    '${doc}[_id]' == '${DOC_ID_1}'
            Should Be Equal    ${doc}[status]    Verified
        END
        IF    '${doc}[_id]' == '${DOC_ID_2}'
            Should Be Equal    ${doc}[status]    Rejected
            Should Not Be Empty    ${doc}[adminFeedback]
        END
    END

TC-DOC-004: Non-Admin Cannot Verify Documents
    [Tags]    integration    documents    security
    &{headers}=    Create Dictionary    Authorization=Bearer ${DOC_STU_TOK}
    &{body}=    Create Dictionary
    ...    studentId=${DOC_STU_ID}    documentId=${DOC_ID_1}    status=Verified
    ${resp}=    POST On Session    gecw_api    /api/admin/verify    json=${body}    headers=${headers}    expected_status=any
    Should Be Equal As Integers    ${resp.status_code}    403
    Should Contain    ${resp.json()}[message]    Admins only
