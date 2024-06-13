// Important data:
const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');
const message1 = "Are you sure you want to delete this comment?";
const message2 = "Once you delete, it's gone for good.";
const inputComment = 'textarea[placeholder="Add a comment..."]';
const issueComment = '[data-testid="issue-comment"]';
const listIssue = '[data-testid="list-issue"]';

function addAComment(comment) {
  cy.contains("Add a comment...").click();
  cy.get(inputComment).type(comment);
  cy.contains("button", "Save").click().should("not.exist");
  cy.contains("Add a comment...").should("exist");
  cy.get(issueComment).should("contain", comment);
}

function editAComment(previousComment, newComment) {
  getIssueDetailsModal().within(() => {
    cy.get(issueComment)
      .should("contain", previousComment)
      .parent()
      .within(() => {
        cy.contains("Edit").click();
      });

    cy.get(inputComment).clear().type(newComment);

    cy.contains("button", "Save").click().should("not.exist");
    cy.get(issueComment).should("contain", newComment);
  });
}

function deleteAComment(comment) {
  getIssueDetailsModal().within(() => {
    cy.get('[data-testid="issue-comment"]').should("contain", comment).parent();
    cy.contains("Delete").click();
  });

  cy.get('[data-testid="modal:confirm"]')
    .contains(message1)
    .should("be.visible")
    .parent()
    .contains(message2)
    .should("be.visible")
    .parent()
    .contains("button", "Delete comment")
    .should("be.visible")
    .click();

  cy.get(issueComment).should("not.contain", comment);
}

describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("https://jira.ivorreic.com/");
    cy.get(listIssue).first().click();
    getIssueDetailsModal().should("be.visible");
  });

  it("Add a comment", () => {
    const comment = "This is a task to be done";

    getIssueDetailsModal().within(() => {
      addAComment(comment);
    });
  });

  it("Edit a comment", () => {
    const previousComment = "This is a task to be done";
    const newComment = "This task is done";

    addAComment(previousComment);
    editAComment(previousComment, newComment);
  });

  it("Delete a comment", () => {
    const comment = "This is a task to be done";

    addAComment(comment);
    deleteAComment(comment);
  });
});
