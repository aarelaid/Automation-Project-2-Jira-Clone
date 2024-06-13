import { faker } from "@faker-js/faker";

// Create issue data fields:
const createIssueWindow = '[data-testid="modal:issue-create"]';
const submitButton = 'button[type="submit"]';
const staticAssignee = "Lord Gaben";

function fillTitleField(text) {
  cy.get('input[name="title"]').type(text);
  cy.get('input[name="title"]').should("have.value", text);
}

function fillDescriptionField(descriptionText) {
  cy.get(".ql-editor").type(descriptionText);
  cy.get(".ql-editor").should("have.text", descriptionText);
}

function selectDropdownOption(dropdownTestId, optionText) {
  if (optionText === "Task") {
    cy.get(`[data-testid="${dropdownTestId}"] div`).should(
      "contain",
      optionText
    );
    return;
  }
  cy.get(`[data-testid="${dropdownTestId}"]`).click();
  cy.get(`[data-testid="select-option:${optionText}"]`, {
    timeout: 10000,
  }).should("be.visible");
  cy.get(`[data-testid="select-option:${optionText}"]`).click();
  cy.get(`[data-testid="${dropdownTestId}"] div`).should("contain", optionText);
}

function createItemAndCloseForm() {
  cy.get(submitButton).click();
  cy.get(createIssueWindow).should("not.exist");
  cy.contains("Issue has been successfully created.").should("be.visible");
  cy.reload();
  cy.contains("Issue has been successfully created.").should("not.exist");
}

function backlogAssertion() {
  cy.get('[data-testid="board-list:backlog"]')
    .should("be.visible")
    .and("have.length", "1")
    .within(() => {
      cy.get('[data-testid="list-issue"]').should("have.length.gt", 0);
      cy.get('[data-testid="list-issue"]')
        .first()
        .within(() => {
          cy.get('[data-testid^="icon:"]').should("be.visible");
        });
      const assignee = staticAssignee;
      if (assignee && assignee !== "") {
        cy.get(`[data-testid="avatar:${assignee}"]`).should("be.visible");
      } else {
        cy.get('[data-testid^="avatar:"]').should("not.exist");
      }
    });
}

describe("Issue create", () => {
  beforeEach(() => {
    Cypress.on("uncaught:exception", (err) => {
      return false;
    });
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Should create an issue and validate it successfully", () => {
    const staticDescriptionText = "TEST_DESCRIPTION";
    const staticTitle = "TEST_TITLE";

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      fillDescriptionField(staticDescriptionText);
      fillTitleField(staticTitle);
    });

    const dropdownSelections = [
      { dropdownTestId: "select:type", optionText: "Story" },
      { dropdownTestId: "select:reporterId", optionText: "Baby Yoda" },
      { dropdownTestId: "form-field:userIds", optionText: "Baby Yoda" },
    ];
    dropdownSelections.forEach((selection) => {
      selectDropdownOption(selection.dropdownTestId, selection.optionText);
    });
    createItemAndCloseForm();
    backlogAssertions();
  });

  it("Should create an issue (bug) and validate it successfully", () => {
    const staticDescriptionText = "My bug description";
    const staticTitle = "Bug";

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      fillDescriptionField(staticDescriptionText);
      fillTitleField(staticTitle);
    });

    const dropdownSelections = [
      { dropdownTestId: "select:type", optionText: "Bug" },
      { dropdownTestId: "select:reporterId", optionText: "Pickle Rick" },
      { dropdownTestId: "form-field:userIds", optionText: "Lord Gaben" },
      { dropdownTestId: "select:priority", optionText: "Highest" },
    ];
    dropdownSelections.forEach((selection) => {
      selectDropdownOption(selection.dropdownTestId, selection.optionText);
    });

    createIssueAndCloseForm();
    backLogAssertions();
  });

  it("Should create another issue with random data and validate it successfully", () => {
    const randomTitle = faker.lorem.words(3);
    const randomDescription = faker.lorem.sentences(2);
  
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      fillDescriptionField(randomDescription);
      fillTitleField(randomTitle);
    });

    const dropdownSelections = [
      { dropdownTestId: "select:type", optionText: "Task" },
      { dropdownTestId: "select:reporterId", optionText: "Baby Yoda" },
      { dropdownTestId: "select:priority", optionText: "Low" },
    ];
    dropdownSelections.forEach((selection) => {
      selectDropdownOption(selection.dropdownTestId, selection.optionText);
    });

    createItemAndCloseForm();
    backlogAssertion();
  });

  it("Should validate title is required field if missing", () => {
    cy.get(createIssueWindow, { timeout: 40000 }).within(() => {
      cy.get(submitButton).click();

      cy.get('[data-testid="form-field:title"]').should(
        "contain",
        "This field is required"
      );
    });
  });
});
