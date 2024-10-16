import { describe, test, expect, jest } from "@jest/globals";
import request from "supertest";
import { app } from "../../index";

import TicketController from "../../src/controllers/ticketController";
import Ticket from "../../src/components/ticket";
import Service from "../../src/components/service";
import { Notification } from "../../src/types/queue";
const baseURL = "/api";

// For unit tests, we need to validate the internal logic of a single component, without the need to test the interaction with other components
jest.mock("../../src/controllers/ticketController");

let testTicket = new Ticket(1, 1, "", 10, "completed",1);
let testService = new Service(1, "Shipping", 10);

describe("TicketRoute unit tests", () => {
  describe("GET /api/tickets", () => {
    test("It returns 200 with the issued ticket", async () => {
      const inputService = {
        ServiceID: testService.serviceID,
      };
      jest
        .spyOn(TicketController.prototype, "getTicket")
        .mockResolvedValueOnce(testTicket);

      const response = await request(app)
        .post(baseURL + "/tickets")
        .send(inputService);
      expect(response.status).toBe(201);
      expect(TicketController.prototype.getTicket).toHaveBeenCalled();
      expect(response.body).toEqual(testTicket);
    });
  });

  describe("PATCH /api/tickets/next-customer/:officerID", () => {
    test("It returns 200 with the next customer ticket", async () => {
      const inputService = {
        ServiceID: testService.serviceID,
      };
      jest
        .spyOn(TicketController.prototype, "nextCustomer")
        .mockResolvedValueOnce(testTicket);

      const response = await request(app)
        .patch(baseURL + "/tickets/next-customer/1")
      expect(response.status).toBe(200);
      expect(TicketController.prototype.nextCustomer).toHaveBeenCalled();
      expect(TicketController.prototype.nextCustomer).toHaveBeenCalledWith("1");
      expect(response.body).toEqual(testTicket);
    });
  });

  describe("GET /api/tickets/:ticketID/notifications", () => {
    test("It returns 200 with the issued ticket", async () => {
      const myTicket: Ticket = new Ticket(1, 1, "2024-10-12", 0, "in queue", 1)
      const nextTicket: Ticket=new Ticket(2,1,"2024-10-12",0,"in progress",1)
      const queues=[
        {serviceName:"Service A",length:2},
        {serviceName:"Service B",length:0}
      ]
      const expectedNotification: Notification= {
        myTicket:myTicket,
        displayBoard: {
          nextTicket:nextTicket,
          queues:queues
        }
      }
      jest
        .spyOn(TicketController.prototype, "getNotifications")
        .mockResolvedValueOnce(expectedNotification);

      const response = await request(app)
        .get(baseURL + "/tickets/1/notifications")
      expect(response.status).toBe(200);
      expect(TicketController.prototype.getNotifications).toHaveBeenCalled();
      expect(TicketController.prototype.getNotifications).toHaveBeenCalledWith("1");
      expect(response.body).toEqual(expectedNotification);
    });
  });
});
