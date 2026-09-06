*** Settings ***
Documentation       Integration Tests — Chatbot + Admission Combined Scenario
Resource            ../resources/common.resource
Suite Setup         Run Keywords    Create API Session    AND    Seed Knowledge Base
Suite Teardown      Delete All Sessions

*** Variables ***
${CB_KEAM}      INT_CHATBOT_STU_001
${CB_PASS}      ChatBot@2024

*** Keywords ***
Seed Knowledge Base
    POST On Session    gecw_api    /api/chatbot/seed

*** Test Cases ***

TC-CBI-001: Pre-Registration Chatbot Queries (Fee, Hostel, CSE)
    [Tags]    integration    chatbot    combined    smoke
    &{fee}=    Create Dictionary    query=What are the fees?
    ${r1}=    POST On Session    gecw_api    /api/chatbot/query    json=${fee}
    Should Be Equal As Integers    ${r1.status_code}    200
    Should Contain    ${r1.json()}[answer]    Fee
    &{hostel}=    Create Dictionary    query=Is hostel available for boys?
    ${r2}=    POST On Session    gecw_api    /api/chatbot/query    json=${hostel}
    Should Contain    ${r2.json()}[answer]    Hostel
    &{cse}=    Create Dictionary    query=How many seats in CSE department?
    ${r3}=    POST On Session    gecw_api    /api/chatbot/query    json=${cse}
    Should Contain    ${r3.json()}[answer]    CSE

TC-CBI-002: Student Registers And Accesses Profile
    [Tags]    integration    chatbot    combined
    &{body}=    Create Dictionary    keamAppNumber=${CB_KEAM}    password=${CB_PASS}
    POST On Session    gecw_api    /api/auth/register    json=${body}    expected_status=any
    &{login}=    Create Dictionary    keamAppNumber=${CB_KEAM}    password=${CB_PASS}
    ${resp}=    POST On Session    gecw_api    /api/auth/login    json=${login}
    Should Be Equal As Integers    ${resp.status_code}    200
    Set Suite Variable    ${CB_TOKEN}    ${resp.json()}[token]
    &{headers}=    Create Dictionary    Authorization=Bearer ${CB_TOKEN}
    ${presp}=    GET On Session    gecw_api    /api/student/profile    headers=${headers}
    Should Be Equal As Integers    ${presp.status_code}    200
    Should Be Equal    ${presp.json()}[keamAppNumber]    ${CB_KEAM}

TC-CBI-003: Post-Login Contact Query And Fallback
    [Tags]    integration    chatbot    combined
    &{contact}=    Create Dictionary    query=How do I contact the office?
    ${r1}=    POST On Session    gecw_api    /api/chatbot/query    json=${contact}
    Should Be Equal As Integers    ${r1.status_code}    200
    Should Contain    ${r1.json()}[answer]    04935
    &{unknown}=    Create Dictionary    query=random nonsense qwerty123
    ${r2}=    POST On Session    gecw_api    /api/chatbot/query    json=${unknown}
    Should Contain    ${r2.json()}[answer]    04935-257321

TC-CBI-004: API Health And 404 Route Check
    [Tags]    integration    smoke
    ${resp}=    GET On Session    gecw_api    /
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Contain    ${resp.json()}[message]    GECW
    ${r404}=    GET On Session    gecw_api    /api/nonexistent/route    expected_status=any
    Should Be Equal As Integers    ${r404.status_code}    404
    Should Contain    ${r404.json()}[message]    not found
