/**
 * This is an example file and approach for POM in Cypress
 */
import IssueModal from "../../pages/IssueModal";

//issue title, that we are testing with, saved into variable
const issueTitle = 'This is an issue of type: Task.';

describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
    cy.contains(issueTitle).click();
    IssueModal.getIssueDetailModal().should('be.visible')
    });
  });

  it("Should delete issue successfully", () => {
  
    const expectedAmountOfIssuesAfterDeletion = 3

    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
    IssueModal.validateIssueVisibilityState(issueTitle,true);
    IssueModal.validateAmountofIssuesInTheBacklogList(expectedAmountOfIssuesAfterDeletion)
  });

  it("Should cancel deletion process successfully", () => {

    const expectedAmountOfIssuesAfterCancel = 4

    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();
    IssueModal.validateIssueVisibilityState(issueTitle,false);
    IssueModal.validateAmountofIssuesInTheBacklogList(expectedAmountOfIssuesAfterCancel)
  });
});