import type { User } from "../interfaces/User";

const baseUrl = "http://localhost:8081";

class UserService {
  async getCsrfToken() {
    const response = await fetch(`${baseUrl}/csrf-token`, {
      credentials: "include",
    });

    return await response.json();
  }

  async getAll() {
    const response = await fetch(`${baseUrl}/users`, {
      credentials: "include",
    });

    return await response.json();
  }

  async getById(id: number) {
    const response = await fetch(`${baseUrl}/users/${id}`, {
      credentials: "include",
    });

    return await response.json();
  }

  async update(id: number, user: User) {
    const response = await fetch(`${baseUrl}/users/${id}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(user),
    });

    if (response.status !== 200) {
      throw new Error("User not logged in");
    }

    return await response.json();
  }

  async delete(id: number) {
    const response = await fetch(`${baseUrl}/users/${id}`, {
      credentials: "include",
      method: "DELETE",
    });

    if (response.status !== 200) {
      throw new Error("User not logged in");
    }

    return await response.json();
  }

  async register(_csrfToken: string, user: User) {
    const response = await fetch(`${baseUrl}/register`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(user),
    });

    if (response.status !== 200) {
      throw new Error("Something went wrong");
    }

    return await response.json();
  }

  async login(_csrfToken: string, email: string, password: string) {
    const response = await fetch(`${baseUrl}/login`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.status !== 200) {
      throw new Error("User not logged in");
    }

    return await response.json();
  }

  async isLogged() {
    const response = await fetch(`${baseUrl}/logged`, {
      credentials: "include",
    });

    if (response.status !== 200) {
      throw new Error("User not logged in");
    }

    return await response.json();
  }

  async logOut() {
    const response = await fetch(`${baseUrl}/logout`, {
      credentials: "include",
    });

    if (response.status !== 200) {
      throw new Error("User not logged in");
    }

    return await response.json();
  }
}

export const userService = new UserService();
