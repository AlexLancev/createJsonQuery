import { createStore, createEvent, sample } from "effector";
import persist from "effector-localstorage";
import { v4 as uuidv4 } from "uuid";
import { createJsonQuery, createJsonMutation, declareParams } from "@farfetched/core";
import { zodContract } from '@farfetched/zod';
import { z as zod } from 'zod';

import { DataType } from "../types";

export const $users = createStore<DataType[]>([]);

export const setUsers = createEvent<DataType[]>();
export const addUser = createEvent<DataType>();
export const deleteUser = createEvent<string>();
export const copyUser = createEvent<string>();

const headers = { "Content-Type": "application/json" };

const UserSchema = zod.object({
  key: zod.string(),
  name: zod.string(),
  age: zod.number(),
  address: zod.string(),
});

const userContract = zodContract(UserSchema);
const UserSchemaArrayContract = zodContract(zod.array(UserSchema));

sample({ clock: setUsers, target: $users });

sample({
  source: $users,
  clock: addUser,
  fn: (state, user) => [...state, user],
  target: $users,
});

sample({
  source: $users,
  clock: deleteUser,
  fn: (state, key) => {
    const userExists = state.some(user => user.key === key);
    if (!userExists) {
      console.warn(`Пользователь с ключом ${key} не найден`);
      return state;
    }
    return state.filter(user => user.key !== key);
  },
  target: $users,
});

sample({
  source: $users,
  clock: copyUser,
  fn: (state, key) => {
    const userToCopy = state.find(user => user.key === key);
    if (!userToCopy) {
      console.warn(`Пользователь с ключом ${key} не найден для копирования`);
      return state;
    }
    const newUser = { ...userToCopy, key: uuidv4() };
    return [...state, newUser];
  },
  target: $users,
});

export const itemsQuery = createJsonQuery({
  request: {
    method: "GET",
    url: "/api/users",
  },
  response: {
    contract: UserSchemaArrayContract,
  },
});

itemsQuery.finished.success.watch(({ result }) => {
  console.log(result);
  setUsers(result);
});

itemsQuery.refresh();


export const deleteUserMutation = createJsonMutation({
  params: declareParams<{key: string}>(),
  request: {
    method: "DELETE",
    url: (key: string) => `/api/users/${key}`,
    headers,
  },
  response: {
    contract: zodContract(zod.string()),
  },
});

deleteUserMutation.finished.success.watch(({ result }) => {
  console.log(`Пользователь удалён: ${result}`);
  deleteUser(result);
});

deleteUserMutation.finished.failure.watch(({ error }) => {
  console.error("Ошибка при удалении пользователя:", error);
});


export const addUserMutation = createJsonMutation({
  params: declareParams<DataType>(),
  request: {
    method: "POST",
    url: "/api/users",
    headers,
    body: (data: DataType) => JSON.stringify(data),
  },
  response: {
    contract: userContract,
  },
});

addUserMutation.finished.success.watch(({ result }) => {
  console.log("Успешный ответ:", result);
  addUser(result);
});

addUserMutation.finished.failure.watch(({ error }) => {
  console.error("Ошибка при добавлении пользователя:", error);
});


export const copyMutation = createJsonMutation({
  params: declareParams<DataType>(),
  request: {
    method: "POST",
    url: "/api/users",
    headers,
    body: (userData: DataType) => JSON.stringify(userData),
  },
  response: {
    contract: userContract,
  },
});

copyMutation.finished.success.watch(({ result }) => {
  addUser(result);
});

copyMutation.finished.failure.watch(({ error }) => {
  console.error("Ошибка при копировании пользователя:", error);
});


persist({ store: $users, key: "users" });
