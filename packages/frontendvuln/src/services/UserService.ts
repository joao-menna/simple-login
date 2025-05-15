import type { User } from "../interfaces/User";

const baseUrl = "http://localhost:8080";

class UserService {
  async getAll() {
    const req = await fetch(`${baseUrl}/user`, {
      credentials: "include",
    });

    return await req.json();
  }

  async getById(id: number) {
    const req = await fetch(`${baseUrl}/user/${id}`, {
      credentials: "include",
    });

    return await req.json();
  }

  async insert(user: User) {
    const req = await fetch(`${baseUrl}/user`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await req.json();
  }

  async update(id: number, user: User) {
    const req = await fetch(`${baseUrl}/user/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await req.json();
  }

  async delete(id: number) {
    const req = await fetch(`${baseUrl}/user/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    return await req.json();
  }

  async login(username: string, password: string) {
    const req = await fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    });

    return await req.json();
  }
}

export const userService = new UserService();
