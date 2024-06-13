// Important data:
const issueDetailsModal = '[data-testid="modal:issue-details"]';
const timeTrackingModal = '[data-testid="modal:tracking"]';
const inputEstimation = '[placeholder="Number"]';
const listIssue = '[data-testid="list-issue"]';
const iconClose = '[data-testid="icon:close"]';
const iconStopwatch = '[data-testid="icon:stopwatch"]';
const inputTime = 'input[placeholder="Number"]';

function addEstimation() {
  cy.get(inputEstimation).clear().type(10).should("have.value", 10);
  cy.get(iconStopwatch).next().should("contain", 10);
}

function updateEstimation() {
  cy.get(inputEstimation).clear().type(20).should("have.value", 20);
  cy.get(iconStopwatch).next().should("contain", 20);
}

function removeEstimation() {
  cy.get(inputEstimation, { timeout: 20000 }).clear().type("{enter}").blur();
  cy.wait(6000);
  cy.get(inputEstimation).should("have.value", "");
  cy.get(issueDetailsModal).click();
  cy.reload();

  cy.get(issueDetailsModal).should("be.visible");
  cy.get(iconStopwatch).next().should("not.contain.value");
}

function logTime() {
  cy.get(iconStopwatch).click();
  cy.contains("Time tracking").parent().should("be.visible");

  cy.get(timeTrackingModal).within(() => {
    cy.get(inputTime).eq(0).clear({ force: true }).type(5, { force: true });

    cy.get(inputTime).eq(1).clear({ force: true }).type(2, { force: true });
  });

  cy.get(timeTrackingModal).within(() => {
    cy.contains("button", "Done").click();
  });

  cy.get(timeTrackingModal).should("not.exist");

  cy.get(issueDetailsModal).within(() => {
    cy.get(iconStopwatch)
      .next()
      .should("not.contain", "No time logged")
      .should("contain", 2)
      .and("contain", 5);
  });
}

function removeLoggedTime() {
  cy.get(iconStopwatch).click();
  cy.contains("Time tracking").parent().should("be.visible");

  cy.get(timeTrackingModal).within(() => {
    cy.get(inputTime).eq(0).clear({ force: true }).should("have.value", "");

    cy.get(inputTime).eq(1).clear({ force: true }).should("have.value", "");
  });

  cy.get(timeTrackingModal).within(() => {
    cy.contains("button", "Done").click();
  });

  cy.get(timeTrackingModal).should("not.exist");

  cy.get(issueDetailsModal).within(() => {
    cy.get(iconStopwatch)
      .next()
      .should("contain", "No time logged")
      .should("contain", "")
      .and("contain", "");
  });
}

describe("Time tracking functionality", () => {
  beforeEach(() => {
    cy.visit("https://jira.ivorreic.com/");
    cy.get(listIssue).first().click();
  });

  it("Should add, edit and remove estimation successfully", () => {
    addEstimation();
    updateEstimation();
    removeEstimation();
  });

  it("Should log time and remove logged time successfully", () => {
    logTime();
    removeLoggedTime();
  });
});
