import { Board } from "@/types";

export const board: Board = {
  hTiles: 5,
  vTiles: 5,
  bombs: 4,
  tiles: [
    [
      {
        id: "3a5e34f1-12b4-4f80-beb9-36071cdbcf09",
        revealed: false,
        flag: false,
        type: "TYPE_BLANK",
        questionmark: false,
        position: { x: 0, y: 0 }
      },
      {
        id: "5e1c80b5-dbff-4992-9464-d8275d278dc9",
        revealed: false,
        flag: false,
        type: "TYPE_BLANK",
        questionmark: false,
        position: { x: 0, y: 1 }
      },
      {
        id: "ebf55e84-ecf5-48b0-ba13-25e6a7fa3c1b",
        revealed: false,
        flag: false,
        type: "TYPE_BLANK",
        questionmark: false,
        position: { x: 0, y: 2 }
      },
      {
        id: "2d6cbab6-4ca3-411a-a478-86fc76823073",
        revealed: false,
        flag: false,
        type: "TYPE_BLANK",
        questionmark: false,
        position: { x: 0, y: 3 }
      },
      {
        id: "ab459f90-dfb6-4516-925e-569824c8c67a",
        revealed: false,
        flag: false,
        type: "TYPE_BLANK",
        questionmark: false,
        position: { x: 0, y: 4 }
      }
    ],
    [
      {
        id: "1ebd02b8-deeb-49c6-bf1d-e1738095b3c7",
        revealed: false,
        flag: false,
        type: "TYPE_BLANK",
        questionmark: false,
        position: { x: 1, y: 0 }
      },
      {
        id: "89a0f877-dea4-43d5-b948-ce939bb0f8da",
        revealed: false,
        flag: false,
        type: "TYPE_NUMBER",
        questionmark: false,
        position: { x: 1, y: 1 },
        value: 1
      },
      {
        id: "9d57a221-af3d-439a-ac19-727b37cc72ba",
        revealed: false,
        flag: false,
        type: "TYPE_NUMBER",
        questionmark: false,
        position: { x: 1, y: 2 },
        value: 2
      },
      {
        id: "a08a3b8a-b7f4-4956-aaf5-f5de25d2710a",
        revealed: false,
        flag: false,
        type: "TYPE_NUMBER",
        questionmark: false,
        position: { x: 1, y: 3 },
        value: 2
      },
      {
        id: "e6e9fc4f-2c23-4e45-a348-b54c36781342",
        revealed: false,
        flag: false,
        type: "TYPE_NUMBER",
        questionmark: false,
        position: { x: 1, y: 4 },
        value: 1
      }
    ],
    [
      {
        id: "aa48e772-42d9-4313-b2ed-c7fc31bb5c57",
        revealed: false,
        flag: false,
        type: "TYPE_BLANK",
        questionmark: false,
        position: { x: 2, y: 0 }
      },
      {
        id: "68de0aed-509b-4836-ae79-1aa251f1c995",
        revealed: false,
        flag: false,
        type: "TYPE_NUMBER",
        questionmark: false,
        position: { x: 2, y: 1 },
        value: 1
      },
      {
        id: "4e5a5e85-4387-4028-a145-3e7bd4758a16",
        revealed: false,
        flag: false,
        type: "TYPE_BOMB",
        questionmark: false,
        position: { x: 2, y: 2 }
      },
      {
        id: "3fba48ee-0144-431e-9eff-4d632b5a9f13",
        revealed: false,
        flag: false,
        type: "TYPE_BOMB",
        questionmark: false,
        position: { x: 2, y: 3 }
      },
      {
        id: "0c9c2087-a897-4973-b194-dbdf07792b73",
        revealed: false,
        flag: false,
        type: "TYPE_NUMBER",
        questionmark: false,
        position: { x: 2, y: 4 },
        value: 2
      }
    ],
    [
      {
        id: "fa6d653f-479e-4f41-8a4c-dcb7dee5fb04",
        revealed: false,
        flag: false,
        type: "TYPE_NUMBER",
        questionmark: false,
        position: { x: 3, y: 0 },
        value: 1
      },
      {
        id: "4b27d6bb-f99b-4736-a0ef-6ff71cb344d8",
        revealed: false,
        flag: false,
        type: "TYPE_NUMBER",
        questionmark: false,
        position: { x: 3, y: 1 },
        value: 2
      },
      {
        id: "3bc2f01d-d341-44d1-a1d4-ffcf9fd257d4",
        revealed: false,
        flag: false,
        type: "TYPE_NUMBER",
        questionmark: false,
        position: { x: 3, y: 2 },
        value: 3
      },
      {
        id: "80fdde40-3bf4-4d42-90bc-a35c19f34098",
        revealed: false,
        flag: false,
        type: "TYPE_NUMBER",
        questionmark: false,
        position: { x: 3, y: 3 },
        value: 3
      },
      {
        id: "3ae5686d-bf6d-490b-b4ab-78dbfb71474e",
        revealed: false,
        flag: false,
        type: "TYPE_BOMB",
        questionmark: false,
        position: { x: 3, y: 4 }
      }
    ],
    [
      {
        id: "943b8896-7308-4ce4-bc21-10072c139708",
        revealed: false,
        flag: false,
        type: "TYPE_NUMBER",
        questionmark: false,
        position: { x: 4, y: 0 },
        value: 1
      },
      {
        id: "dbaed335-22c1-44ec-8772-bcad9c357ebf",
        revealed: false,
        flag: false,
        type: "TYPE_BOMB",
        questionmark: false,
        position: { x: 4, y: 1 }
      },
      {
        id: "880a8284-2f43-4c37-af74-b822e5f194c8",
        revealed: false,
        flag: false,
        type: "TYPE_NUMBER",
        questionmark: false,
        position: { x: 4, y: 2 },
        value: 1
      },
      {
        id: "fcf741ea-aac9-439f-88fa-796a622ebb47",
        revealed: false,
        flag: false,
        type: "TYPE_NUMBER",
        questionmark: false,
        position: { x: 4, y: 3 },
        value: 1
      },
      {
        id: "f7cd36d4-8fc2-4bb1-ae17-b94573174572",
        revealed: false,
        flag: false,
        type: "TYPE_NUMBER",
        questionmark: false,
        position: { x: 4, y: 4 },
        value: 1
      }
    ]
  ]
};
