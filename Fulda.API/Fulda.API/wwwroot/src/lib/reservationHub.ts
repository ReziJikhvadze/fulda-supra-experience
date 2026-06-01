import * as signalR from "@microsoft/signalr";
import type { ReservationDto } from "@/lib/api";
import { getToken } from "@/lib/auth";

const hubPath = "/hubs/reservations";

export function createReservationHubConnection() {
  const base = import.meta.env.VITE_API_URL ?? "";
  const url = `${base}${hubPath}`;

  return new signalR.HubConnectionBuilder()
    .withUrl(url, {
      accessTokenFactory: () => getToken() ?? "",
    })
    .withAutomaticReconnect()
    .build();
}

export type ReservationCreatedHandler = (reservation: ReservationDto) => void;
