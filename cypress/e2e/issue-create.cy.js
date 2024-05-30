import { faker } from '@faker-js/faker';
// Create issue data fields:
const createIssueWindow = '[data-testid="modal:issue-create"]'
const description = '.ql-editor';
const title = 'input[name="title"]';
const issueType = '[data-testid="select:type"]';
const priority = '[data-testid="select:priority"]';
const assignee = '[data-testid="select:userIds"]';
const reporter = '[data-testid="select:reporterId"]';
const submitButton = 'button[type="submit"]';
const backLogList = '[data-testid="board-list:backlog"]';

// random data
const randomTitle = faker.lorem.word(); 
const randomDescription = faker.lorem.words(5); 


describe('Issue create', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err) => { return false; });
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .then((url) => {
        // System will already open issue creating modal in beforeEach block
        cy.visit(url + '/board?modal-issue-create=true');
      });
  });

  it('Should create an issue and validate it successfully', () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get(createIssueWindow).within(() => {
      // Type value to description input field
      cy.get(description).type('TEST_DESCRIPTION');
      cy.get(description).should('have.text', 'TEST_DESCRIPTION');

      // Type value to title input field
      // Order of filling in the fields is first description, then title on purpose
      // Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get(title).type('TEST_TITLE');
      cy.get(title).should('have.value', 'TEST_TITLE');

      // Open issue type dropdown and choose Story
      cy.get(issueType).click();
      cy.get('[data-testid="select-option:Story"]').wait(1000).trigger('mouseover').trigger('click');
      cy.get('[data-testid="icon:story"]').should('be.visible');

      // Select Baby Yoda from reporter dropdown
      cy.get(reporter).click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      // Select Baby Yoda from assignee dropdown
      cy.get(assignee).click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      // Click on button "Create issue"
      cy.get(submitButton).click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get(createIssueWindow).should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get(backLogList)
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('TEST_TITLE')
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
            cy.get('[data-testid="icon:story"]').should('be.visible');
          });
      });

      cy.get(backLogList)
      .contains("TEST_TITLE")
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
        cy.get('[data-testid="icon:story"]').should('be.visible');
      });
  });

  it('Should create an issue (bug) and validate it successfully', () => {
    // System finds modal for creating issue and does next steps inside of it 
    cy.get(createIssueWindow,{ timeout: 40000 }).within(() => {
      // Type value to description input field 
      cy.get(description).type('My bug description');
      cy.get(description).should('have.text', 'My bug description')

      // Type value to title input field 
      cy.get(title).type('Bug');
      cy.get(title).should('have.value', 'Bug');

      // Open issue dropdown and choose Bug
      cy.get(issueType).click();
      cy.get('[data-testid="select-option:Bug"]').wait(1000).trigger('mouseover').trigger('click');
      cy.get('[data-testid="icon:bug"]').should('be.visible');

      // Open priority dropdown and choose Highest
      cy.get(priority).click();
      cy.get('[data-testid="select-option:Highest"]').click();
      cy.get('[data-testid="icon:arrow-up"]').should('be.visible');

      // Select Pickle Rick from the reporter dropdown
      cy.get(reporter).click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');

      // Select Lord Gaben from the assignee dropdown
      cy.get(assignee).click();
      cy.get('[data-testid="avatar:Lord Gaben"]').click();
      cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');

      // Click on the Create issue button
      cy.get(submitButton).click();
    });

      // Assert that the modal is closed and successful message is shown
      cy.get(createIssueWindow).should('not.exist');
      cy.contains('Issue has been successfully created.').should('be.visible');

     // Reload the page to be able to see recently created issue
     // Assert that successful message has dissappeared after the reload
      cy.reload();
      cy.contains('Issue has been successfully created.').should('not.exist');

     // Assert than only one list with name Backlog is visible and do steps inside of it
      cy.get(backLogList)
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('Bug')
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
            cy.get('[data-testid="icon:bug"]').should('be.visible');
          });
      });

    cy.get(backLogList)
      .contains('Bug')
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
        cy.get('[data-testid="icon:bug"]').should('be.visible');
      });
  });

  it('Should create an issue using the random data plugin and validate it successfully', () => {
    // System finds modal for creating issue and does next steps inside of it 
    cy.get(createIssueWindow).within(() => {
      // Type value to description input field 
      cy.get(description).type(randomDescription);
      cy.get(description).should('have.text', randomDescription)

      // Type value to title input field 
      cy.get(title).type(randomTitle);
      cy.get(title).should('have.value', randomTitle);
      cy.get(issueType).scrollIntoView()

      // Open issue dropdown and choose Task
      cy.get(issueType).should('contain', 'Task');
      cy.get('[data-testid="icon:task"]').should('be.visible');

      // Open priority dropdown and choose Highest
      cy.get(priority).click();
      cy.get('[data-testid="select-option:Low"]').click();
      cy.get('[data-testid="icon:arrow-down"]').should('be.visible');

      // Select Pickle Rick from the reporter dropdown
      cy.get(reporter).click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="avatar:Baby Yoda"]').should('be.visible');

      // Click on the Create issue button
      cy.get(submitButton).click();

    });

     // Assert that the modal is closed and successful message is shown
      cy.get(createIssueWindow).should('not.exist');
      cy.contains('Issue has been successfully created.').should('be.visible');

     // Reload the page to be able to see recently created issue
     // Assert that successful message has dissappeared after the reload
      cy.reload();
      cy.contains('Issue has been successfully created.').should('not.exist');

     // Assert than only one list with name Backlog is visible and do steps inside of it
      cy.get(backLogList)
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains(randomTitle)
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="icon:arrow-down"]').should('be.visible');
            cy.get('[data-testid="icon:task"]').should('be.visible');
          });
      });

    cy.get(backLogList)
      .contains(randomTitle)
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="icon:arrow-down"]').should('be.visible');
        cy.get('[data-testid="icon:task"]').should('be.visible');
      });
  });

    it('Should validate title is required field if missing', () => {
      // System finds modal for creating issue and does next steps inside of it
      cy.get(createIssueWindow, { timeout: 40000 }).within(() => {
        // Try to click create issue button without filling any data
        cy.get(submitButton).click();
  
        // Assert that correct error message is visible
        cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
      });
    });
  });
