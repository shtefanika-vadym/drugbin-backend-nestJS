import { Recycle } from "src/recycle/recycle.model";

const getPdfTemplate = ({
  firstName,
  lastName,
  drugList,
  createdAt,
  hospital,
}: Recycle) => {
  const drugRows = drugList.map(
    (drug, index) => `
  <tr style="height: 40px">
    <td style="text-align: left; width: 60px; font-weight: 400; font-size: 13px; color: #011640; padding: 0 0 0 30px;">
      ${index + 1}
    </td>
    <td style="text-align: left; font-weight: 400; font-size: 13px; color: #011640;">
      ${drug.drugDetails.name}
    </td>
    <td style="text-align: left; width: 140px; font-weight: 400; font-size: 13px; color: #011640;">
      ${drug.pack}
    </td>
    <td style="text-align: left; width: 100px; font-weight: 400; font-size: 13px; color: #011640;">
      ${drug?.lot ?? ""}
    </td>
    <td style="text-align: left; font-weight: 400; font-size: 13px; color: #011640;">
      ${drug.quantity}
    </td>
    <td style="text-align: left; width: 100px; font-weight: 400; font-size: 13px; color: #011640;">
    </td>
  </tr>
`
  );
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Document</title>
      </head>
      <body>
        <div
          style="
            max-width: 800px;
            margin: auto;
            padding: 30px;
            font-size: 16px;
            line-height: 24px;
            font-family: Montserrat;
          "
        >
          <img
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ4IiBoZWlnaHQ9IjM4IiB2aWV3Qm94PSIwIDAgMTQ4IDM4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMS41MDQ3NiA1Ljg4NzdIMTIuNTgxOEMyMC41NTkyIDUuODg3NyAyNi4wMjc1IDEwLjY5NDUgMjYuMDI3NSAxOC4wNzk3QzI2LjAyNzUgMjUuNDY0OSAyMC41NTkyIDMwLjI3MTYgMTIuNTgxOCAzMC4yNzE2SDEuNTA0NzZWNS44ODc3Wk0xMi4zMDI3IDI1LjYzNzZDMTcuMTQ0OSAyNS42Mzc2IDIwLjMxNCAyMi43NDYxIDIwLjMxNCAxOC4wNzgxQzIwLjMxNCAxMy40MTAxIDE3LjE0NDkgMTAuNTE4NyAxMi4zMDI3IDEwLjUxODdINy4xNDczN1YyNS42MzZIMTIuMzAyN1YyNS42Mzc2WiIgZmlsbD0iIzI5NDlBNiIvPgo8cGF0aCBkPSJNNDEuNTI3IDExLjI1MjRWMTYuMjY4OUM0MS4wNzM2IDE2LjIzMzUgNDAuNzI1MSAxNi4xOTk2IDQwLjMwNzIgMTYuMTk5NkMzNy4zMTA4IDE2LjE5OTYgMzUuMzI2MSAxNy44MzczIDM1LjMyNjEgMjEuNDI0MlYzMC4yNzE0SDI5Ljg5MTdWMTEuNTNIMzUuMDgyNVYxNC4wMDM2QzM2LjQwNTYgMTIuMTkxNiAzOC42MzU1IDExLjI1MjQgNDEuNTI3IDExLjI1MjRaIiBmaWxsPSIjMjk0OUE2Ii8+CjxwYXRoIGQ9Ik04Ni42NjE4IDExLjUzVjI3LjEzNDdDODYuNjYxOCAzNC4xMDA0IDgyLjkwMDUgMzcuMzA2NSA3Ni4xNDMgMzcuMzA2NUM3Mi41ODk5IDM3LjMwNjUgNjkuMTQxOCAzNi40MzUyIDY2Ljk0NzMgMzQuNzI5Nkw2OS4xMDYzIDMwLjgyODFDNzAuNzA4NiAzMi4xMTczIDczLjMyMDkgMzIuOTUzMSA3NS43MjUxIDMyLjk1MzFDNzkuNTU3MiAzMi45NTMxIDgxLjIyODkgMzEuMjEyMSA4MS4yMjg5IDI3LjgzMzNWMjcuMDMyOUM3OS44MDA5IDI4LjU5OTcgNzcuNzQ1MiAyOS4zNjYxIDc1LjMwNzIgMjkuMzY2MUM3MC4xMTY0IDI5LjM2NjEgNjUuOTM3MyAyNS43Nzc2IDY1LjkzNzMgMjAuMzA5M0M2NS45MzczIDE0Ljg0MDkgNzAuMTE2NCAxMS4yNTI0IDc1LjMwNzIgMTEuMjUyNEM3Ny45MTk1IDExLjI1MjQgODAuMDc4NSAxMi4xMjM3IDgxLjUwOCAxMy45MzQyVjExLjUzSDg2LjY2MzNIODYuNjYxOFpNODEuMjk4MyAyMC4zMDc3QzgxLjI5ODMgMTcuNTU2NiA3OS4yNDI2IDE1LjcwOTIgNzYuMzg2NiAxNS43MDkyQzczLjUzMDYgMTUuNzA5MiA3MS40NDExIDE3LjU1NTEgNzEuNDQxMSAyMC4zMDc3QzcxLjQ0MTEgMjMuMDYwNCA3My41MzA2IDI0LjkwNjMgNzYuMzg2NiAyNC45MDYzQzc5LjI0MjYgMjQuOTA2MyA4MS4yOTgzIDIzLjA2MDQgODEuMjk4MyAyMC4zMDc3WiIgZmlsbD0iIzI5NDlBNiIvPgo8cGF0aCBkPSJNMTE0LjQ1NyAyMy42MTc0QzExNC40NTcgMjcuODMyIDExMS4xMTQgMzAuMjcwMSAxMDQuNzAzIDMwLjI3MDFIOTIuMDkzNVY1Ljg4NzdIMTA0LjAwNkMxMTAuMTAyIDUuODg3NyAxMTMuMjM3IDguNDMwNjUgMTEzLjIzNyAxMi4yMjczQzExMy4yMzcgMTQuNjY1NCAxMTEuOTg0IDE2LjU0NjggMTA5Ljk5NyAxNy41OTI0QzExMi43MTUgMTguNDYzNyAxMTQuNDU2IDIwLjU1MzIgMTE0LjQ1NiAyMy42MTg5TDExNC40NTcgMjMuNjE3NFpNOTcuNzAyMiAxMC4xMzc4VjE1Ljg4NTJIMTAzLjMxMUMxMDYuMDYyIDE1Ljg4NTIgMTA3LjU2MSAxNC45MTA2IDEwNy41NjEgMTIuOTkzOEMxMDcuNTYxIDExLjA3NjkgMTA2LjA2NCAxMC4xMzc4IDEwMy4zMTEgMTAuMTM3OEg5Ny43MDIyWk0xMDguNzc5IDIzLjAyNTJDMTA4Ljc3OSAyMC45Njk2IDEwNy4yMTIgMTkuOTk1IDEwNC4yODUgMTkuOTk1SDk3LjcwMjJWMjYuMDIxNkgxMDQuMjg1QzEwNy4yMTEgMjYuMDIxNiAxMDguNzc5IDI1LjExNjMgMTA4Ljc3OSAyMy4wMjUyWiIgZmlsbD0iIzI5NDlBNiIvPgo8cGF0aCBkPSJNMTE3LjY5NSA1Ljg4NzY4QzExNy42OTUgNC4xODA1NiAxMTkuMDU0IDIuODU3NDIgMTIxLjA3NCAyLjg1NzQyQzEyMy4wOTQgMi44NTc0MiAxMjQuNDUzIDQuMTExMTYgMTI0LjQ1MyA1Ljc4MjgyQzEyNC40NTMgNy41OTQ4IDEyMy4wOTQgOC45MTc5NCAxMjEuMDc0IDguOTE3OTRDMTE5LjA1NCA4LjkxNzk0IDExNy42OTUgNy41OTQ4IDExNy42OTUgNS44ODc2OFpNMTE4LjM1NyAxMS41MzAzSDEyMy43OTFWMzAuMjcwMUgxMTguMzU3VjExLjUzMDNaIiBmaWxsPSIjMjk0OUE2Ii8+CjxwYXRoIGQ9Ik0xNDggMTkuNTQyOVYzMC4yNzE0SDE0Mi41NjVWMjAuMzc4OEMxNDIuNTY1IDE3LjM0ODUgMTQxLjE3MSAxNS45NTQ0IDEzOC43NjkgMTUuOTU0NEMxMzYuMTU2IDE1Ljk1NDQgMTM0LjI3NSAxNy41NTY3IDEzNC4yNzUgMjEuMDA0OVYzMC4yNjk5SDEyOC44NDFWMTEuNTMwMUgxMzQuMDMxVjEzLjcyNDVDMTM1LjQ5NSAxMi4xMjIzIDEzNy42ODkgMTEuMjUxIDE0MC4yMzIgMTEuMjUxQzE0NC42NTcgMTEuMjUxIDE0OCAxMy44Mjc5IDE0OCAxOS41NDE0VjE5LjU0MjlaIiBmaWxsPSIjMjk0OUE2Ii8+CjxwYXRoIGQ9Ik00OC4wMTczIDEzLjgwMThMNDguMDE3MyAyMy44NDg1QzQ4LjAxNzMgMjYuMTQ5MiA0OS44ODI0IDI4LjAxNDIgNTIuMTgzMSAyOC4wMTQySDU0LjExOUM1Ni40MTk3IDI4LjAxNDIgNTguMjg0NyAyNi4xNDkyIDU4LjI4NDcgMjMuODQ4NUw1OC4yODQ3IDEzLjgwMTgiIHN0cm9rZT0iIzI5NDlBNiIgc3Ryb2tlLXdpZHRoPSI0LjkwMDg2IiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIi8+CjxwYXRoIGQ9Ik00NS40NjY5IDkuMTE5ODNMNDUuMDg4MiA2LjU3MTY3TDQ4LjI2MTggNi4wNTg4NUw0OC4yNzU1IDQuMTU5NEw1NS45MDI2IDIuOTg4ODhMNTYuNzU0OSA0LjgzMjE3TDYwLjQzOTkgNC4zNzIzNkw2MC44MDUxIDcuMDAxNzdMNDUuNDY2OSA5LjExOTgzWiIgZmlsbD0iIzI5NDlBNiIvPgo8cGF0aCBkPSJNNDguMjYxOCA2LjA1ODg1TDQ1LjA4ODIgNi41NzE2N0w0NS40NjY5IDkuMTE5ODRMNjAuODA1MSA3LjAwMTc3TDYwLjQzOTkgNC4zNzIzNkw1Ni43NTQ5IDQuODMyMTdNNDguMjYxOCA2LjA1ODg1TDQ4LjI3NTUgNC4xNTk0TDU1LjkwMjYgMi45ODg4OEw1Ni43NTQ5IDQuODMyMTdNNDguMjYxOCA2LjA1ODg1TDU2Ljc1NDkgNC44MzIxNyIgc3Ryb2tlPSIjMjk0OUE2IiBzdHJva2Utd2lkdGg9IjEuMjI1MjEiLz4KPC9zdmc+Cg=="
            style="width: 100%; max-width: 156px"
          />
          <div
            style="
              width: 100%;
              height: 1px;
              margin: 5px 0 15px 0;
              background-color: #2949a6;
            "
          ></div>
    
          <p style="text-align: end">Data ${createdAt
            .toISOString()
            .slice(0, 10)}</p>
    
          <h1
            style="
              text-align: center;
              font-size: 20px;
              font-weight: 600;
              margin: 90px 0 30px 0;
            "
          >
            Proces verbal de predare-primire medicamente expirate
          </h1>
    
          <p>
            Subsemnatul(a) <span style="font-weight: 600">${firstName ?? ""} ${
    lastName ?? ""
  }</span>,
            predau spre distrugere in
            <span style="font-weight: 600">${
              hospital.name
            }</span> urmatoarele medicamente:
          </p>
    
          <table id="red" style="width: 100%" cellspacing="0">
            <tr style="background-color: #ebf0fb; height: 40px">
              <th
                style="
                  text-align: left;
                  width: 60px;
                  font-weight: 400;
                  font-size: 13px;
                  color: #1c3375;
                  padding: 0 0 0 30px;
                  border-radius: 10px 0 0 10px;
                "
              >
                Nr
              </th>
              <th
                style="
                  text-align: left;
                  font-weight: 400;
                  font-size: 13px;
                  color: #1c3375;
                "
              >
                Nume
              </th>
              <th
                style="
                  text-align: left;
                  width: 140px;
                  font-weight: 400;
                  font-size: 13px;
                  color: #1c3375;
                "
              >
                Tip (cutie/blister)
              </th>
              <th
                style="
                  text-align: left;
                  width: 100px;
                  font-weight: 400;
                  font-size: 13px;
                  color: #1c3375;
                "
              >
                Lot
              </th>
              <th
                style="
                  width: 100px;
                  text-align: left;
                  font-weight: 400;
                  font-size: 13px;
                  color: #1c3375;
                "
              >
                Cantitate
              </th>
              <th
                style="
                  text-align: left;
                  width: 100px;
                  font-weight: 400;
                  font-size: 13px;
                  color: #1c3375;
                  border-radius: 0 10px 10px 0;
                "
              >
                Observatii
              </th>
            </tr>
            ${drugRows.join("")}
          </table>
    
          <p style="font-size: 15px; margin: 15px 0 50px 0">
            Motivul predarii medicamentelor: PP-OP-05-F03, rev 06
          </p>
    
          <table style="width: 100%">
            <tr>
              <td>
                <span>Am predat,</span><br />
                <span>${firstName ?? ""} ${lastName ?? ""}</span>
              </td>
              <td style="text-align: end">
                <span>Am preluat,</span><br />
                <span>${hospital.name}</span>
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
  `;
};

export const RecycleUtils = {
  getPdfTemplate,
};
