import { describe, test, expect, jest } from "@jest/globals";
import TicketDAO from "../../src/dao/ticketDAO";
import db from "../../src/db/db";
import { Database } from "sqlite3";
import Service from "../../src/components/service";
import Ticket from "../../src/components/ticket";
import { TimeHandler } from "../../src/helper";

jest.mock("../../src/db/db.ts");

const timeHandler=new TimeHandler()
const formattedDate = timeHandler.getCurrentTime()
let testNewTicket = new Ticket(1, 1, formattedDate, 0, "in queue",0);
let testService = new Service(1, "Shipping", 10);

describe("TicketDAO unit tests", () => {
  describe("getTicket", () => {
    test("It should resolve the issued ticket", async () => {
      const ticketDAO = new TicketDAO();

      const mockDBGet = jest
        .spyOn(db, "get")
        .mockImplementation((sql, callback) => {
          const mockRow: any = { pastTicket: null };
          callback(null, mockRow);
          return {} as Database;
        });

      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, [], callback) => {
          callback(null);
          return {} as Database;
        });

      const result = await ticketDAO.getTicket(testService.serviceID);

      expect(result).toEqual(testNewTicket);
      mockDBRun.mockRestore();
      mockDBGet.mockRestore();
    });
  });

  describe("nextCustomer", () => {
    test("It should resolve the next customer ticket", async () => {
      const ticketDAO = new TicketDAO();

      const expectedTicket= new Ticket(1,1,"2024-10-12",0,"in progress",1)

      const mockDBGet = jest
        .spyOn(db, "get")
        .mockImplementation((sql, [], callback) => {
          const mockRow: any = { 
            TicketID:1,
            ServiceID:1,
            IssuedTime:"2024-10-12",
            EstimatedTime:0
          };
          callback(null, mockRow);
          return {} as Database;
        });

      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, [], callback) => {
          callback(null);
          return {} as Database;
        });

      const result = await ticketDAO.nextCustomer(1);

      expect(result).toEqual(expectedTicket);
      mockDBRun.mockRestore();
      mockDBGet.mockRestore();
    });
  });

  describe("getQueues", () => {
    test("It should resolve the queues array", async () => {
      const ticketDAO = new TicketDAO();

      const expectedQueues=[
        {ServiceName:"Service A",length:2},
        {ServiceName:"Service B",length:0}
      ]

      const mockDBAll = jest
        .spyOn(db, "all")
        .mockImplementation((sql, [], callback) => {
          const mockRows: any = [
            {ServiceName:"Service A",length:2},
            {ServiceName:"Service B",length:0}
          ];
          callback(null, mockRows);
          return {} as Database;
        });

      const result = await ticketDAO.getQueues();

      expect(result).toEqual(expectedQueues);
      mockDBAll.mockRestore();
    });
  });

  describe("getMyTicket", () => {
    test("It should resolve the queues array", async () => {
      const ticketDAO = new TicketDAO();

      const mockDBGet = jest
        .spyOn(db, "get")
        .mockImplementation((sql, [], callback) => {
          const mockRow: any = testNewTicket;
          callback(null, mockRow);
          return {} as Database;
        });

      const result = await ticketDAO.getMyTicket(1);

      expect(result).toEqual(testNewTicket);
      mockDBGet.mockRestore();
    });
  });

  describe("getNextTicket", () => {
    test("It should resolve the queues array", async () => {
      const ticketDAO = new TicketDAO();

      const mockDBGet = jest
        .spyOn(db, "get")
        .mockImplementation((sql, [], callback) => {
          const mockRow: any = testNewTicket;
          callback(null, mockRow);
          return {} as Database;
        });

      const result = await ticketDAO.getNextTicket();

      expect(result).toEqual(testNewTicket);
      mockDBGet.mockRestore();
    });
  });
});
