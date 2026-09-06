*** Settings ***
Documentation       Unit Tests — Authentication Module
Resource            ../resources/common.resource
Suite Setup         Create API Session
Suite Teardown      Delete All Sessions

*** Variables ***
${UNIQUE_KEAM}      UNIT_AUTH_001

*** Test Cases ***

TC-AUTH-001: Student Registration With Valid Credentials
    [Tags]    unit    auth    positive    smoke
    &{body}=    Create Dictionary    keamAppNumber=${UNIQUE_KEAM}    password=ValidPass@1
    ${resp}=    POST On Session    gecw_api    /api/auth/register    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    200
    ${json}=    Set Variable    ${resp.json()}
    Dictionary Should Contain Key    ${json}    token
    Dictionary Should Contain Key    ${json}    student

TC-AUTH-002: Duplicate Student Registration Is Rejected
    [Tags]    unit    auth    negative
    &{body}=    Create Dictionary    keamAppNumber=${UNIQUE_KEAM}    password=AnotherPass@1
    ${resp}=    POST On Session    gecw_api    /api/auth/register    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    400
    Should Contain    ${resp.json()}[message]    Already registered

TC-AUTH-003: Registration Fails Without Required Fields
    [Tags]    unit    auth    negative    validation
    &{body}=    Create Dictionary    password=ValidPass@1
    ${resp}=    POST On Session    gecw_api    /api/auth/register    json=${body}    expected_status=any
    Should Not Be Equal As Integers    ${resp.status_code}    200

TC-AUTH-004: Student Login With Correct Credentials
    [Tags]    unit    auth    positive    smoke
    &{body}=    Create Dictionary    keamAppNumber=${UNIQUE_KEAM}    password=ValidPass@1
    ${resp}=    POST On Session    gecw_api    /api/auth/login    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    200
    ${json}=    Set Variable    ${resp.json()}
    Dictionary Should Contain Key    ${json}    token
    Dictionary Should Not Contain Key    ${json}[student]    password

TC-AUTH-005: Student Login With Wrong Password
    [Tags]    unit    auth    negative    security
    &{body}=    Create Dictionary    keamAppNumber=${UNIQUE_KEAM}    password=WrongPass@999
    ${resp}=    POST On Session    gecw_api    /api/auth/login    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    400
    Should Contain    ${resp.json()}[message]    Incorrect Password

TC-AUTH-006: Login With Non-Existent KEAM Returns 400
    [Tags]    unit    auth    negative
    &{body}=    Create Dictionary    keamAppNumber=GHOST_KEAM_000    password=AnyPass@1
    ${resp}=    POST On Session    gecw_api    /api/auth/login    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    400
    Should Contain    ${resp.json()}[message]    not found

TC-AUTH-007: Password Reset And Re-Login Flow
    [Tags]    unit    auth    positive
    &{reset}=    Create Dictionary    keamAppNumber=${UNIQUE_KEAM}    newPassword=NewPass@999
    ${resp}=    POST On Session    gecw_api    /api/auth/reset-password    json=${reset}
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Contain    ${resp.json()}[message]    reset successfully
    &{old}=    Create Dictionary    keamAppNumber=${UNIQUE_KEAM}    password=ValidPass@1
    ${resp2}=    POST On Session    gecw_api    /api/auth/login    json=${old}
    Should Be Equal As Integers    ${resp2.status_code}    400
    &{new}=    Create Dictionary    keamAppNumber=${UNIQUE_KEAM}    password=NewPass@999
    ${resp3}=    POST On Session    gecw_api    /api/auth/login    json=${new}
    Should Be Equal As Integers    ${resp3.status_code}    200

TC-AUTH-008: Admin Login With Correct Credentials
    [Tags]    unit    auth    positive    smoke
    &{body}=    Create Dictionary    username=${ADMIN_USER}    password=${ADMIN_PASS}
    ${resp}=    POST On Session    gecw_api    /api/auth/admin/login    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    200
    ${json}=    Set Variable    ${resp.json()}
    Dictionary Should Contain Key    ${json}    token
    Dictionary Should Not Contain Key    ${json}[admin]    password

TC-AUTH-009: Admin Login With Wrong Password Returns 400
    [Tags]    unit    auth    negative    security
    &{body}=    Create Dictionary    username=${ADMIN_USER}    password=WrongAdminPass
    ${resp}=    POST On Session    gecw_api    /api/auth/admin/login    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    400
    Should Contain    ${resp.json()}[message]    Incorrect Password

TC-AUTH-010: JWT Token Has Three Parts
    [Tags]    unit    auth    positive    security
    &{body}=    Create Dictionary    keamAppNumber=${UNIQUE_KEAM}    password=NewPass@999
    ${resp}=    POST On Session    gecw_api    /api/auth/login    json=${body}
    ${token}=    Set Variable    ${resp.json()}[token]
    ${parts}=    Split String    ${token}    .
    Length Should Be    ${parts}    3
