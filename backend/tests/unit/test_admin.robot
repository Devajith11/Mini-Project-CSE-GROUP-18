*** Settings ***
Documentation       Unit Tests — Admin Module
Resource            ../resources/common.resource
Suite Setup         Run Keywords    Create API Session
...                 AND             Login As Admin
Suite Teardown      Delete All Sessions

*** Test Cases ***

TC-ADM-001: Admin Can List All Students
    [Tags]    unit    admin    positive    smoke
    ${headers}=    Get Admin Auth Header
    ${resp}=    GET On Session    gecw_api    /api/admin/students    headers=${headers}
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Not Be Empty    ${resp.json()}

TC-ADM-002: Student List Does Not Expose Passwords
    [Tags]    unit    admin    positive    security
    ${headers}=    Get Admin Auth Header
    ${resp}=    GET On Session    gecw_api    /api/admin/students    headers=${headers}
    FOR    ${s}    IN    @{resp.json()}
        Dictionary Should Not Contain Key    ${s}    password
    END

TC-ADM-003: Student List Rejects Unauthenticated Request
    [Tags]    unit    admin    negative    security
    ${resp}=    GET On Session    gecw_api    /api/admin/students    expected_status=any
    Should Be Equal As Integers    ${resp.status_code}    401

TC-ADM-004: Student List Rejects Student Token
    [Tags]    unit    admin    negative    security
    &{reg}=    Create Dictionary    keamAppNumber=ADM_TEST_STU    password=TestPass@1
    POST On Session    gecw_api    /api/auth/register    json=${reg}    expected_status=any
    &{login}=    Create Dictionary    keamAppNumber=ADM_TEST_STU    password=TestPass@1
    ${resp}=    POST On Session    gecw_api    /api/auth/login    json=${login}
    &{stu_headers}=    Create Dictionary    Authorization=Bearer ${resp.json()}[token]
    ${list_resp}=    GET On Session    gecw_api    /api/admin/students    headers=${stu_headers}    expected_status=any
    Should Be Equal As Integers    ${list_resp.status_code}    403
    Should Contain    ${list_resp.json()}[message]    Admins only

TC-ADM-005: Verify Document With Invalid IDs Returns Error
    [Tags]    unit    admin    negative
    ${headers}=    Get Admin Auth Header
    &{body}=    Create Dictionary
    ...    studentId=000000000000000000000000
    ...    documentId=000000000000000000000001
    ...    status=Verified
    ${resp}=    POST On Session    gecw_api    /api/admin/verify    json=${body}    headers=${headers}    expected_status=any
    Should Be True    ${resp.status_code} == 404 or ${resp.status_code} == 500

TC-ADM-006: Update Status Requires Auth And Returns 404 For Invalid Student
    [Tags]    unit    admin    negative
    ${headers}=    Get Admin Auth Header
    &{body}=    Create Dictionary    studentId=000000000000000000000099    status=Admitted
    ${resp}=    POST On Session    gecw_api    /api/admin/update-status    json=${body}    headers=${headers}    expected_status=any
    Should Be Equal As Integers    ${resp.status_code}    404
    Should Contain    ${resp.json()}[message]    Student not found

TC-ADM-007: Update Remarks Requires Auth
    [Tags]    unit    admin    negative    security
    &{body}=    Create Dictionary    studentId=fakeid    adminRemarks=Some remark
    ${resp}=    POST On Session    gecw_api    /api/admin/update-remarks    json=${body}    expected_status=any
    Should Be Equal As Integers    ${resp.status_code}    401

TC-ADM-008: Verify Document Endpoint Requires Admin Auth
    [Tags]    unit    admin    negative    security
    &{body}=    Create Dictionary    studentId=fakeid    documentId=fakeid    status=Verified
    ${resp}=    POST On Session    gecw_api    /api/admin/verify    json=${body}    expected_status=any
    Should Be Equal As Integers    ${resp.status_code}    401

TC-ADM-009: Update Status Requires Admin Auth
    [Tags]    unit    admin    negative    security
    &{body}=    Create Dictionary    studentId=fakeid    status=Admitted
    ${resp}=    POST On Session    gecw_api    /api/admin/update-status    json=${body}    expected_status=any
    Should Be Equal As Integers    ${resp.status_code}    401

TC-ADM-010: Update Remarks With Invalid ID Returns 404
    [Tags]    unit    admin    negative
    ${headers}=    Get Admin Auth Header
    &{body}=    Create Dictionary    studentId=000000000000000000000099    adminRemarks=Test Remark
    ${resp}=    POST On Session    gecw_api    /api/admin/update-remarks    json=${body}    headers=${headers}    expected_status=any
    Should Be Equal As Integers    ${resp.status_code}    404
