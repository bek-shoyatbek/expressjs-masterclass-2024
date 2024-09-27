import { EventsService } from "#/modules/events/events.service";
import { validateCreateEventsDto } from "#/shared/validators/event-validators/request-body.validator";
import { validateSearchParams } from "#/shared/validators/event-validators/search-params.validator";
import { Router } from "express";
import {
  EventsSearchParamsDto,
  eventsSearchParamsDtoSchema,
} from "./request-validator-schemas/events-search-params.schema";
import {
  createEventDtoSchema,
} from "./request-validator-schemas/create-event.schema";
import { CreateEventDto } from "./dto/create-event.dto";
import { eventsDeleteParamsDtoSchema } from "./request-validator-schemas/events-delete-params.schema";
import { validateDeleteParams } from "#/shared/validators/event-validators/delete-params.validator";
import { UpdateEventDto } from "./dto/update-event.dto";
import { validateEventId } from "#/shared/validators/event-validators/validate-eventId.validator";
import { eventsEventIdDtoSchema } from "./request-validator-schemas/events-eventId.schema";
import { TicketsService } from "../tickets/tickets.service";

export const EventsController = Router();

EventsController.get(
  "/",
  validateSearchParams(eventsSearchParamsDtoSchema),
  async (req, res) => {
    const searchParams = req.query as unknown as EventsSearchParamsDto;

    const events = await EventsService.getEvents();

    return res.status(200).json({
      message: "Events retrieved successfully",
      data: events,
      searchParams,
    });
  },
);

EventsController.get("/:eventId/tickets", validateEventId(eventsEventIdDtoSchema), async (req, res) => {
  const eventId = req.params["eventId"]!;

  const tickets = await TicketsService.getTicketsByEventId(eventId);
  if (!tickets) {
    return res.status(404).json({
      message: "Tickets not found",
    });
  }

  return res.status(200).json({
    message: "Tickets retrieved successfully",
    data: tickets,
  });

})

EventsController.post(
  "/",
  validateCreateEventsDto(createEventDtoSchema),
  async (req, res) => {
    const requestBody = req.body as unknown as CreateEventDto;

    const result = await EventsService.createEvent(requestBody);

    return res.status(201).json({
      message: "Events created successfully",
      data: result,
    });
  },
);

EventsController.delete(
  "/:eventId",
  validateDeleteParams(eventsDeleteParamsDtoSchema),
  async (req, res) => {
    const eventId = req.params["eventId"];
    const result = await EventsService.deleteEventById(eventId as string);

    return res.status(204).json({
      message: result,
      data: [],
    });
  },
);

EventsController.post(
  "/",
  validateCreateEventsDto(createEventDtoSchema),
  async (req, res) => {
    const requestBody = req.body as unknown as CreateEventDto;

    const result = await EventsService.createEvent(requestBody);

    return res.status(201).json({
      message: "Events created successfully",
      data: result,
    });
  },
);

EventsController.put("/:eventId", async (req, res) => {
  const eventId = req.params.eventId;

  const requestBody = req.body as unknown as UpdateEventDto;

  console.log("Update event: ", requestBody);

  const result = await EventsService.updateEventById(eventId, requestBody);

  return res.status(200).json({
    message: "Events updated successfully",
    data: result,
  });
})
