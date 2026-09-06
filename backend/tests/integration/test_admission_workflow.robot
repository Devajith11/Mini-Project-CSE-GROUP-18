*** Settings ***
Documentation       Integration Tests — Student Admission Workflow (End-to-End)
Resource            ../resources/common.resource
Suite Setup         Create API Session
Suite Teardown      Delete All Sessions

*** Variables ***
${INT_KEAM}         INT_FLOW_001
${INT_PASS}         IntPass@2024
${INT_STUDENT_ID}   ${EMPTY}
${INT_STUDENT_TOK}  ${EMPTY}
${INT_ADMIN_TOK}    ${EMPTY}

*** Test Cases ***

TC-INT-001: Student Registers And Logs In
    [Tags]    integration    smoke    workflow
    &{body}=    Create Dictionary    keamAppNumber=${INT_KEAM}    password=${INT_PASS}
    ${resp}=    POST On Session    gecw_api    /api/auth/register    json=${body}    expected_status=any
    Should Be True    ${resp.status_code} == 200 or ${resp.status_code} == 400
    &{login}=    Create Dictionary    keamAppNumber=${INT_KEAM}    password=${INT_PASS}
    ${lresp}=    POST On Session    gecw_api    /api/auth/login    json=${login}
    Should Be Equal As Integers    ${lresp.status_code}    200
    Set Suite Variable    ${INT_STUDENT_TOK}    ${lresp.json()}[token]
    Set Suite Variable    ${INT_STUDENT_ID}     ${lresp.json()}[student][_id]

TC-INT-002: Student Submits Personal And Academic Details
    [Tags]    integration    workflow
    &{headers}=    Create Dictionary    Authorization=Bearer ${INT_STUDENT_TOK}
    &{personal}=    Create Dictionary
    ...    name=Arjun Kumar    email=arjun.kumar@example.com
    ...    phone=9876543210    address=House No. 12, Mananthavady, Wayanad
    &{body}=    Create Dictionary    personalDetails=${personal}
    ${resp}=    PUT On Session    gecw_api    /api/student/update    json=${body}    headers=${headers}
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Be Equal    ${resp.json()}[personalDetails][name]    Arjun Kumar
    &{academic}=    Create Dictionary    keamRank=${502}    plusTwoMarks=${96}    schoolName=GHSS Mananthavady
    &{body2}=    Create Dictionary    academicDetails=${academic}
    ${resp2}=    PUT On Session    gecw_api    /api/student/update    json=${body2}    headers=${headers}
    Should Be Equal As Integers    ${resp2.status_code}    200
    Should Be Equal As Numbers    ${resp2.json()}[academicDetails][keamRank]    502

TC-INT-003: Student Selects Branch And Category
    [Tags]    integration    workflow
    &{headers}=    Create Dictionary    Authorization=Bearer ${INT_STUDENT_TOK}
    &{body}=    Create Dictionary    branch=CSE    category=General
    ${resp}=    PUT On Session    gecw_api    /api/student/update    json=${body}    headers=${headers}
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Be Equal    ${resp.json()}[branch]    CSE
    Should Be Equal    ${resp.json()}[category]    General

TC-INT-004: Admin Logs In And Sees Student In List
    [Tags]    integration    workflow
    &{body}=    Create Dictionary    username=admin_gecw    password=admin123
    ${resp}=    POST On Session    gecw_api    /api/auth/admin/login    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    200
    Set Suite Variable    ${INT_ADMIN_TOK}    ${resp.json()}[token]
    &{headers}=    Create Dictionary    Authorization=Bearer ${INT_ADMIN_TOK}
    ${lresp}=    GET On Session    gecw_api    /api/admin/students    headers=${headers}
    Should Be Equal As Integers    ${lresp.status_code}    200
    ${found}=    Set Variable    ${FALSE}
    FOR    ${s}    IN    @{lresp.json()}
        IF    '${s}[keamAppNumber]' == '${INT_KEAM}'
            ${found}=    Set Variable    ${TRUE}
        END
    END
    Should Be True    ${found}    msg=Student INT_FLOW_001 not found in admin list

TC-INT-005: Admin Updates Status And Sends Remarks
    [Tags]    integration    workflow
    &{headers}=    Create Dictionary    Authorization=Bearer ${INT_ADMIN_TOK}
    &{body}=    Create Dictionary    studentId=${INT_STUDENT_ID}    status=Action Required
    ${resp}=    POST On Session    gecw_api    /api/admin/update-status    json=${body}    headers=${headers}
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Be Equal    ${resp.json()}[status]    Action Required
    &{rbody}=    Create Dictionary
    ...    studentId=${INT_STUDENT_ID}
    ...    adminRemarks=Please re-upload your Transfer Certificate (TC) — current upload is blurry.
    ${rresp}=    POST On Session    gecw_api    /api/admin/update-remarks    json=${rbody}    headers=${headers}
    Should Be Equal As Integers    ${rresp.status_code}    200
    Should Contain    ${rresp.json()}[adminRemarks]    Transfer Certificate

TC-INT-006: Student Sees Updated Status And Remarks
    [Tags]    integration    workflow
    &{headers}=    Create Dictionary    Authorization=Bearer ${INT_STUDENT_TOK}
    ${resp}=    GET On Session    gecw_api    /api/student/profile    headers=${headers}
    Should Be Equal As Integers    ${resp.status_code}    200
    ${json}=    Set Variable    ${resp.json()}
    Should Be Equal    ${json}[status]    Action Required
    Should Contain    ${json}[adminRemarks]    Transfer Certificate

TC-INT-007: Admin Admits Student And Profile Reflects Final Status
    [Tags]    integration    workflow    smoke
    &{headers}=    Create Dictionary    Authorization=Bearer ${INT_ADMIN_TOK}
    &{body}=    Create Dictionary    studentId=${INT_STUDENT_ID}    status=Admitted
    ${resp}=    POST On Session    gecw_api    /api/admin/update-status    json=${body}    headers=${headers}
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Be Equal    ${resp.json()}[status]    Admitted
    &{stu_headers}=    Create Dictionary    Authorization=Bearer ${INT_STUDENT_TOK}
    ${presp}=    GET On Session    gecw_api    /api/student/profile    headers=${stu_headers}
    Should Be Equal    ${presp.json()}[status]    Admitted
