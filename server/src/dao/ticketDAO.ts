import db from "../db/db";
import Ticket from "../components/ticket";
import { Queue } from "../types/queue";
import { TicketNotFoundError } from "../errors/ticketError";
import { TimeHandler } from "../helper";

class TicketDAO {
  private timeHandler: TimeHandler;

  constructor() {
    this.timeHandler = new TimeHandler();
  }

  /*
        Returns the newly generated ticket.
        -DB errors
        The ticket is marked as "in queue".

        DB: table Ticket (TicketID, ServiceID, IssuedTime, EstimatedTime, Status),
            table Service (ServiceID, ServiceName, ServiceTime).

        Status can be: "in queue", "in progress", "completed".
    */
  async getTicket(service: number) {
    return new Promise<Ticket | null>((resolve, reject) => {
      try {
        const ticketID_query = "SELECT MAX(TicketID) AS pastTicket FROM Ticket";
        const insertQueue_query =
          "INSERT INTO Ticket VALUES(?,?,?,null,'in queue', null)";

        const formattedDateTime = this.timeHandler.getCurrentTime();

        let newTicket: Ticket = new Ticket(
          1,
          service,
          formattedDateTime,
          0,
          "in queue",
          0
        );

        db.get(ticketID_query, (err: Error | null, row: any) => {
          if (err) return reject(err);
          if (row.pastTicket != null) newTicket.ticketID = row.pastTicket + 1;
          db.run(
            insertQueue_query,
            [newTicket.ticketID, newTicket.serviceID, newTicket.issuedTime],
            (err: Error | null) => {
              console.log(err);
              if (err) return reject(err);
              return resolve(newTicket);
            }
          );
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  async nextCustomer(officerID: number) {
    return new Promise<Ticket | null>((resolve, reject) => {
      try {
        const getTicketSql =
          "WITH TicketQueue AS ( " +
          "    SELECT T.ServiceID, COUNT(*) AS QueueLength " +
          "    FROM Ticket T " +
          "    WHERE T.Status = 'in queue' " +
          "    GROUP BY T.ServiceID " +
          "), NextTicket AS ( " +
          "    SELECT T.TicketID, T.ServiceID, T.IssuedTime, T.EstimatedTime, S.ServiceTime, Q.QueueLength " +
          "    FROM Ticket T " +
          "    JOIN Officer O ON O.ServiceID = T.ServiceID " +
          "    JOIN Service S ON S.ServiceID = T.ServiceID " +
          "    JOIN TicketQueue Q ON Q.ServiceID = T.ServiceID " +
          "    WHERE O.OfficerID = ? AND T.Status = 'in queue' " +
          ") " +
          "SELECT TicketID, ServiceID, IssuedTime, EstimatedTime " +
          "FROM NextTicket " +
          "ORDER BY QueueLength DESC, ServiceTime ASC, TicketID ASC " +
          "LIMIT 1;";

        const updateStatusSql =
          "UPDATE Ticket SET Status = 'in progress', CounterID = ? WHERE TicketID = ?";

        db.get(getTicketSql, [officerID], (err: Error | null, row: any) => {
          if (err) return reject(err);
          if (!row) return resolve(null);

          const returnedTicket = new Ticket(
            row.TicketID,
            row.ServiceID,
            row.IssuedTime,
            row.EstimatedTime,
            "in progress",
            officerID
          );

          db.run(
            updateStatusSql,
            [officerID, returnedTicket.ticketID],
            (err: Error | null) => {
              if (err) return reject(err);
              return resolve(returnedTicket);
            }
          );
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /**
   * Returns the queues of the "in queue" tickets with their lengths.
   */
  getQueues(): Promise<Queue[]> {
    return new Promise((resolve, reject) => {
      try {
        const sql = `
                    SELECT S.ServiceName, COUNT(T.TicketID) AS length
                    FROM TICKET T
                    JOIN Service S ON T.ServiceID = S.ServiceID
                    WHERE Status = 'in queue'
                    GROUP BY S.ServiceName;
                `;
        db.all(sql, [], (err: Error | null, queues: Queue[]) => {
          if (err) {
            reject(err);
          }
          resolve(queues);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getMyTicket(ticketID: number): Promise<Ticket> {
    return new Promise<Ticket>((resolve, reject) => {
      try {
        const sql = `
                    SELECT * 
                    FROM Ticket
                    WHERE TicketID = ?;
                `;
        db.get(sql, [ticketID], (err: Error | null, ticket: Ticket) => {
          if (err) {
            reject(err);
          }
          if (!ticket) {
            reject(new TicketNotFoundError());
            return;
          }
          resolve(ticket);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  getNextTicket(): Promise<Ticket> {
    return new Promise<Ticket>((resolve, reject) => {
      try {
        const sql = `
                  SELECT *
                  FROM Ticket
                  WHERE Status = "in progress"
                  ORDER BY IssuedTime DESC
                  LIMIT 1;
                `;
        db.get(sql, [], (err: Error | null, ticket: Ticket) => {
          if (err) {
            reject(err);
          }
          if (!ticket) {
            reject(new TicketNotFoundError());
            return;
          }
          resolve(ticket);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default TicketDAO;
