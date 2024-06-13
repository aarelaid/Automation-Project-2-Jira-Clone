// Important data:
const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');

function addAComment(comment) {
  cy.contains("Add a comment...").click();
  cy.get('textarea[placeholder="Add a comment..."]').type(comment);
  cy.contains("button", "Save").click().should("not.exist");
  cy.contains("Add a comment...").should("exist");
  cy.get('[data-testid="issue-comment"]').should("contain", comment);
}

function editAComment(previousComment, newComment) {
  getIssueDetailsModal().within(() => {
    cy.get('[data-testid="issue-comment"]')
      .should("contain", previousComment)
      .parent()
      .within(() => {
        cy.contains("Edit").click();
      });

    cy.get('textarea[placeholder="Add a comment..."]').clear().type(newComment);

    cy.contains("button", "Save").click().should("not.exist");
    cy.get('[data-testid="issue-comment"]').should("contain", newComment);
  });
}

function deleteComment(comment) {
  getIssueDetailsModal().within(() => {
    cy.get('[data-testid="issue-comment"]').should("contain", comment).parent();
    cy.contains("Delete").click();
  });

  cy.get('[data-testid="modal:confirm"]')
    .contains("Are you sure you want to delete this comment?")
    .should("be.visible")
    .parent()
    .contains("Once you delete, it's gone for good.")
    .should("be.visible")
    .parent()
    .contains("button", "Delete comment")
    .should("be.visible")
    .click();

  cy.get('[data-testid="issue-comment"]').should("not.contain", comment);
}

describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
        getIssueDetailsModal().should("be.visible");
      });
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
    deleteComment(comment);
  });
});
