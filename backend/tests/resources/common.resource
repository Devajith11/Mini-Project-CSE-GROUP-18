*** Settings ***
Library    RequestsLibrary
Library    Collections
Library    String
Library    OperatingSystem
Library    JSONLibrary

*** Variables ***
${BASE_URL}         http://localhost:5001
${API_URL}          ${BASE_URL}/api
${AUTH_URL}         ${API_URL}/auth
${STUDENT_URL}      ${API_URL}/student
${ADMIN_URL}        ${API_URL}/admin
${CHATBOT_URL}      ${API_URL}/chatbot

# Default test credentials
${STUDENT_KEAM}     TEST123456
${STUDENT_PASS}     TestPass@123
${ADMIN_USER}       admin_gecw
${ADMIN_PASS}       admin123

# Shared state (set during tests)
${STUDENT_TOKEN}    ${EMPTY}
${ADMIN_TOKEN}      ${EMPTY}
${STUDENT_ID}       ${EMPTY}

*** Keywords ***
Create API Session
    [Documentation]    Creates a requests session pointing to the backend API
    Create Session    gecw_api    ${BASE_URL}    verify=False

Register New Student
    [Arguments]    ${keam}    ${password}
    [Documentation]    Registers a student and returns the response JSON
    &{body}=    Create Dictionary    keamAppNumber=${keam}    password=${password}
    ${resp}=    POST On Session    gecw_api    /api/auth/register    json=${body}
    RETURN    ${resp}

Login As Student
    [Arguments]    ${keam}=${STUDENT_KEAM}    ${password}=${STUDENT_PASS}
    [Documentation]    Logs in as student and stores token in suite variable
    &{body}=    Create Dictionary    keamAppNumber=${keam}    password=${password}
    ${resp}=    POST On Session    gecw_api    /api/auth/login    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    200
    ${json}=    Set Variable    ${resp.json()}
    Set Suite Variable    ${STUDENT_TOKEN}    ${json}[token]
    Set Suite Variable    ${STUDENT_ID}    ${json}[student][_id]
    RETURN    ${resp}

Login As Admin
    [Arguments]    ${username}=${ADMIN_USER}    ${password}=${ADMIN_PASS}
    [Documentation]    Logs in as admin and stores token in suite variable
    &{body}=    Create Dictionary    username=${username}    password=${password}
    ${resp}=    POST On Session    gecw_api    /api/auth/admin/login    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    200
    ${json}=    Set Variable    ${resp.json()}
    Set Suite Variable    ${ADMIN_TOKEN}    ${json}[token]
    RETURN    ${resp}

Get Student Auth Header
    [Documentation]    Returns Authorization header dict for student requests
    &{headers}=    Create Dictionary    Authorization=Bearer ${STUDENT_TOKEN}
    RETURN    ${headers}

Get Admin Auth Header
    [Documentation]    Returns Authorization header dict for admin requests
    &{headers}=    Create Dictionary    Authorization=Bearer ${ADMIN_TOKEN}
    RETURN    ${headers}

Response Should Be Success
    [Arguments]    ${resp}    ${status_code}=200
    Should Be Equal As Integers    ${resp.status_code}    ${status_code}
    Dictionary Should Contain Key    ${resp.json()}    message

Response Should Contain Token
    [Arguments]    ${resp}
    ${json}=    Set Variable    ${resp.json()}
    Dictionary Should Contain Key    ${json}    token
    Should Not Be Empty    ${json}[token]

Cleanup Test Student
    [Arguments]    ${keam}=${STUDENT_KEAM}
    [Documentation]    Utility log - actual DB cleanup done via admin routes in real setup
    Log    Cleanup requested for student: ${keam}
