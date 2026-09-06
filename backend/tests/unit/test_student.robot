*** Settings ***
Documentation       Unit Tests — Student Module
Resource            ../resources/common.resource
Suite Setup         Run Keywords    Create API Session
...                 AND             Register And Login Test Student
Suite Teardown      Delete All Sessions

*** Variables ***
${STUDENT_KEAM_UT}      UNIT_STU_001
${STUDENT_PASS_UT}      StudPass@123

*** Keywords ***
Register And Login Test Student
    &{body}=    Create Dictionary    keamAppNumber=${STUDENT_KEAM_UT}    password=${STUDENT_PASS_UT}
    POST On Session    gecw_api    /api/auth/register    json=${body}    expected_status=any
    &{login_body}=    Create Dictionary    keamAppNumber=${STUDENT_KEAM_UT}    password=${STUDENT_PASS_UT}
    ${login_resp}=    POST On Session    gecw_api    /api/auth/login    json=${login_body}
    Should Be Equal As Integers    ${login_resp.status_code}    200
    Set Suite Variable    ${STUDENT_TOKEN}    ${login_resp.json()}[token]
    Set Suite Variable    ${STUDENT_ID}       ${login_resp.json()}[student][_id]

*** Test Cases ***

TC-STU-001: Get Student Profile With Valid Token
    [Tags]    unit    student    positive    smoke
    ${headers}=    Get Student Auth Header
    ${resp}=    GET On Session    gecw_api    /api/student/profile    headers=${headers}
    Should Be Equal As Integers    ${resp.status_code}    200
    ${json}=    Set Variable    ${resp.json()}
    Should Be Equal    ${json}[keamAppNumber]    ${STUDENT_KEAM_UT}
    Dictionary Should Not Contain Key    ${json}    password

TC-STU-002: Get Profile Without Token Returns 401
    [Tags]    unit    student    negative    security
    ${resp}=    GET On Session    gecw_api    /api/student/profile    expected_status=any
    Should Be Equal As Integers    ${resp.status_code}    401
    Should Contain    ${resp.json()}[message]    No token

TC-STU-003: Get Profile With Invalid Token Returns 401
    [Tags]    unit    student    negative    security
    &{headers}=    Create Dictionary    Authorization=Bearer this.is.a.fake.token
    ${resp}=    GET On Session    gecw_api    /api/student/profile    headers=${headers}    expected_status=any
    Should Be Equal As Integers    ${resp.status_code}    401

TC-STU-004: Update Personal Details Successfully
    [Tags]    unit    student    positive
    ${headers}=    Get Student Auth Header
    &{personal}=    Create Dictionary    name=John Doe    email=john@example.com    phone=9876543210
    &{body}=    Create Dictionary    personalDetails=${personal}
    ${resp}=    PUT On Session    gecw_api    /api/student/update    json=${body}    headers=${headers}
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Be Equal    ${resp.json()}[personalDetails][name]    John Doe

TC-STU-005: Update Branch And Category Successfully
    [Tags]    unit    student    positive
    ${headers}=    Get Student Auth Header
    &{body}=    Create Dictionary    branch=CSE    category=SC
    ${resp}=    PUT On Session    gecw_api    /api/student/update    json=${body}    headers=${headers}
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Be Equal    ${resp.json()}[branch]    CSE
    Should Be Equal    ${resp.json()}[category]    SC

TC-STU-006: Update Profile Without Auth Returns 401
    [Tags]    unit    student    negative    security
    &{body}=    Create Dictionary    branch=ECE
    ${resp}=    PUT On Session    gecw_api    /api/student/update    json=${body}    expected_status=any
    Should Be Equal As Integers    ${resp.status_code}    401

TC-STU-007: Admin Token Cannot Access Student Update Endpoint
    [Tags]    unit    student    negative    security
    &{admin_body}=    Create Dictionary    username=admin_gecw    password=admin123
    ${admin_resp}=    POST On Session    gecw_api    /api/auth/admin/login    json=${admin_body}
    &{headers}=    Create Dictionary    Authorization=Bearer ${admin_resp.json()}[token]
    &{body}=    Create Dictionary    branch=ECE
    ${resp}=    PUT On Session    gecw_api    /api/student/update    json=${body}    headers=${headers}    expected_status=any
    Should Be Equal As Integers    ${resp.status_code}    403
    Should Contain    ${resp.json()}[message]    Students only

TC-STU-008: Upload Without File Returns 400
    [Tags]    unit    student    negative    validation
    ${headers}=    Get Student Auth Header
    ${resp}=    POST On Session    gecw_api    /api/student/upload    headers=${headers}    expected_status=any
    Should Be Equal As Integers    ${resp.status_code}    400
    Should Contain    ${resp.json()}[message]    upload a file

TC-STU-009: Update Academic Details Successfully
    [Tags]    unit    student    positive
    ${headers}=    Get Student Auth Header
    &{academic}=    Create Dictionary    keamRank=${1234}    plusTwoMarks=${95}    schoolName=Test School
    &{body}=    Create Dictionary    academicDetails=${academic}
    ${resp}=    PUT On Session    gecw_api    /api/student/update    json=${body}    headers=${headers}
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Be Equal As Numbers    ${resp.json()}[academicDetails][keamRank]    1234

TC-STU-010: Upload Endpoint Requires Authentication
    [Tags]    unit    student    negative    security
    ${resp}=    POST On Session    gecw_api    /api/student/upload    expected_status=any
    Should Be Equal As Integers    ${resp.status_code}    401
