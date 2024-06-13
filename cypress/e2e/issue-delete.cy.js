// Used data:
const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');
const getDeleteButton = () => cy.get('[data-testid="icon:trash"]');
const getConfirmPopup = () => cy.get('[data-testid="modal:confirm"]');
const getDeleteIssueButton = () => cy.get("button").contains("Delete issue");
const getCancelButton = () => cy.get("button").contains("Cancel");
const iconClose = '[data-testid="icon:close"]';
const backLogList = '[data-testid="board-list:backlog"]';
const issueTitle = "This is an issue of type: Task";

describe("Issue delete", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issueTitle).click();
        getIssueDetailsModal().should("be.visible");
      });
  });

  it("Should delete an issue and validate it successfully", () => {
    const expectedAmountOfIssuesAfterDeletion = 3;

    getIssueDetailsModal().within(() => {
      getDeleteButton().click();
    });

    getConfirmPopup()
      .should("be.visible")
      .within(() => {
        cy.contains("Are you sure you want to delete this issue?").should(
          "be.visible"
        );
        cy.contains("Once you delete, it's gone for good").should("be.visible");
        getDeleteIssueButton().click();
        getConfirmPopup().should("not.exist");
      });

    cy.get(backLogList)
      .should("be.visible")
      .and("have.length", "1")
      .children()
      .should("have.length", "3")
      .within(() => {
        cy.contains(issueTitle).should("not.exist");
      });
  });

  it("Should initiate issue deleting process and then canceling it", () => {
    const expectedAmountOfIssuesAfterCancel = 4;

    getIssueDetailsModal()
      .should("be.visible")
      .within(() => {
        getDeleteButton().click();
      });

    getConfirmPopup()
      .should("be.visible")
      .within(() => {
        cy.contains("Are you sure you want to delete this issue?").should(
          "be.visible"
        );
        cy.contains("Once you delete, it's gone for good").should("be.visible");
        getCancelButton().click();
      });

    getConfirmPopup().should("not.exist");
    getIssueDetailsModal()
      .should("be.visible")
      .within(() => {
        cy.get(iconClose).eq(0).click();
      });

    cy.get(backLogList)
      .should("be.visible")
      .and("have.length", "1")
      .children()
      .should("have.length", "4")
      .within(() => {
        cy.contains(issueTitle).should("be.visible");
      });
  });
});
