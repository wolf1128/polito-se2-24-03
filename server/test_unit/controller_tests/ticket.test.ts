import { test, expect, jest, describe } from "@jest/globals";
import TicketController from "../../src/controllers/ticketController";
import TicketDAO from "../../src/dao/ticketDAO";
import Service from "../../src/components/service";
import Ticket from "../../src/components/ticket";
import { Notification } from "../../src/types/queue";

jest.mock("../../src/db/db.ts");
jest.mock("../../src/dao/ticketDAO.ts");

let testService = new Service(1, "Shipping", 10);

describe("Ticket Controller Unit Tests", () => {
  describe("getTicket", () => {
    test("It should return an instance of issued ticket", async () => {
      const expectedTicket = {
        ticketID: 1,
        serviceID: 1,
        issuedTime: "2024-10-12",
        estimatedTime: 0,
        status: "in queue",
        counterID: 0
      };
      jest
        .spyOn(TicketDAO.prototype, "getTicket")
        .mockResolvedValueOnce(expectedTicket);
      const controller = new TicketController();
      const response = await controller.getTicket(testService.serviceID);

      expect(TicketDAO.prototype.getTicket).toHaveBeenCalledTimes(1);
      expect(response).toBe(expectedTicket);
    });
  });

  describe("nextCustomer", () => {
    test("It should return an instance of ticket", async () => {
      const expectedTicket: Ticket = new Ticket(1, 1, "2024-10-12", 0, "in queue", 1)
      jest
        .spyOn(TicketDAO.prototype, "nextCustomer")
        .mockResolvedValueOnce(expectedTicket);
      const controller = new TicketController();
      const response = await controller.nextCustomer(1);

      expect(TicketDAO.prototype.nextCustomer).toHaveBeenCalledTimes(1);
      expect(TicketDAO.prototype.nextCustomer).toBeCalledWith(1);
      expect(response).toBe(expectedTicket);
    });
  });

  describe("getNotifications", () => {
    test("It should return an instance of notification", async () => {
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
        .spyOn(TicketDAO.prototype, "getMyTicket")
        .mockResolvedValueOnce(myTicket);
      jest
        .spyOn(TicketDAO.prototype, "getNextTicket")
        .mockResolvedValueOnce(nextTicket);
      jest
        .spyOn(TicketDAO.prototype, "getQueues")
        .mockResolvedValueOnce(queues);
      const controller = new TicketController();
      const response = await controller.getNotifications(1);

      expect(TicketDAO.prototype.getMyTicket).toHaveBeenCalledTimes(1);
      expect(TicketDAO.prototype.getNextTicket).toHaveBeenCalledTimes(1);
      expect(TicketDAO.prototype.getQueues).toHaveBeenCalledTimes(1);
      expect(TicketDAO.prototype.getMyTicket).toBeCalledWith(1);
      expect(response).toEqual(expectedNotification);
    });
  });

});
