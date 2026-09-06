*** Settings ***
Documentation       Unit Tests — Chatbot Module
Resource            ../resources/common.resource
Suite Setup         Run Keywords    Create API Session    AND    Seed Chatbot Data
Suite Teardown      Delete All Sessions

*** Keywords ***
Seed Chatbot Data
    ${resp}=    POST On Session    gecw_api    /api/chatbot/seed
    Should Be Equal As Integers    ${resp.status_code}    200

*** Test Cases ***

TC-BOT-001: Chatbot Responds To Admission Query
    [Tags]    unit    chatbot    positive    smoke
    &{body}=    Create Dictionary    query=What are the admission requirements?
    ${resp}=    POST On Session    gecw_api    /api/chatbot/query    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Not Be Empty    ${resp.json()}[answer]
    Should Contain    ${resp.json()}[answer]    Admission

TC-BOT-002: Chatbot Responds To Fee Query
    [Tags]    unit    chatbot    positive
    &{body}=    Create Dictionary    query=What is the fee structure?
    ${resp}=    POST On Session    gecw_api    /api/chatbot/query    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Contain    ${resp.json()}[answer]    Fee

TC-BOT-003: Chatbot Returns Fallback For Unknown Query
    [Tags]    unit    chatbot    positive
    &{body}=    Create Dictionary    query=what is the meaning of life xyz123
    ${resp}=    POST On Session    gecw_api    /api/chatbot/query    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Contain    ${resp.json()}[answer]    04935-257321

TC-BOT-004: Chatbot Query Fails Without Query Field
    [Tags]    unit    chatbot    negative    validation
    &{body}=    Create Dictionary    message=some text
    ${resp}=    POST On Session    gecw_api    /api/chatbot/query    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    400
    Should Contain    ${resp.json()}[message]    required

TC-BOT-005: Chatbot Query Is Case Insensitive
    [Tags]    unit    chatbot    positive
    &{body}=    Create Dictionary    query=HOSTEL facilities
    ${resp}=    POST On Session    gecw_api    /api/chatbot/query    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Contain    ${resp.json()}[answer]    Hostel

TC-BOT-006: Seed Endpoint Returns Success And Replaces Data
    [Tags]    unit    chatbot    positive
    # Add custom intent then re-seed; it should disappear
    &{custom}=    Create Dictionary
    ...    keywords=${{\"dummy_key_xyz\"}}
    ...    answer=This should be removed after seed
    ...    category=Test
    POST On Session    gecw_api    /api/chatbot/add    json=${custom}
    POST On Session    gecw_api    /api/chatbot/seed
    &{query_body}=    Create Dictionary    query=dummy_key_xyz
    ${resp}=    POST On Session    gecw_api    /api/chatbot/query    json=${query_body}
    Should Contain    ${resp.json()}[answer]    04935-257321

TC-BOT-007: Add New Intent And Query It
    [Tags]    unit    chatbot    positive
    &{body}=    Create Dictionary
    ...    keywords=${{\"robottest\", \"autotest\"}}
    ...    answer=This answer is from the Robot Framework test suite.
    ...    category=Test
    ${resp}=    POST On Session    gecw_api    /api/chatbot/add    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Contain    ${resp.json()}[message]    added successfully
    &{query_body}=    Create Dictionary    query=What about robottest?
    ${qresp}=    POST On Session    gecw_api    /api/chatbot/query    json=${query_body}
    Should Contain    ${qresp.json()}[answer]    Robot Framework

TC-BOT-008: Get All Intents Returns List With Required Fields
    [Tags]    unit    chatbot    positive
    ${resp}=    GET On Session    gecw_api    /api/chatbot/all
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Not Be Empty    ${resp.json()}
    FOR    ${item}    IN    @{resp.json()}
        Dictionary Should Contain Key    ${item}    keywords
        Dictionary Should Contain Key    ${item}    answer
        Dictionary Should Contain Key    ${item}    category
    END

TC-BOT-009: Chatbot Responds To Hostel Query
    [Tags]    unit    chatbot    positive
    &{body}=    Create Dictionary    query=Is there a hostel facility available?
    ${resp}=    POST On Session    gecw_api    /api/chatbot/query    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Contain    ${resp.json()}[answer]    Hostel

TC-BOT-010: Chatbot Responds To Scholarship Query
    [Tags]    unit    chatbot    positive
    &{body}=    Create Dictionary    query=Are there any scholarships available?
    ${resp}=    POST On Session    gecw_api    /api/chatbot/query    json=${body}
    Should Be Equal As Integers    ${resp.status_code}    200
    Should Contain    ${resp.json()}[answer]    Scholarship
