using FluentValidation;
using Fulda.Application.DTOs.Reservations;

namespace Fulda.Application.Validators;

public class CreateReservationValidator : AbstractValidator<CreateReservationRequest>
{
    public CreateReservationValidator()
    {
        RuleFor(x => x.CustomerName)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(80);

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("A valid email address is required.")
            .MaximumLength(120);

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required.")
            .MaximumLength(30);

        RuleFor(x => x.ReservationDate)
            .Must(d => d >= DateOnly.FromDateTime(DateTime.Today))
            .WithMessage("Reservation date cannot be in the past.");

        RuleFor(x => x.GuestCount)
            .InclusiveBetween(1, 20)
            .WithMessage("Guest count must be between 1 and 20.");

        RuleFor(x => x.SpecialRequest)
            .MaximumLength(500)
            .When(x => x.SpecialRequest is not null);
    }
}

public class UpdateReservationStatusValidator : AbstractValidator<UpdateReservationStatusRequest>
{
    private static readonly string[] Allowed = ["Pending", "Confirmed", "Cancelled"];

    public UpdateReservationStatusValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty()
            .Must(s => Allowed.Contains(s, StringComparer.OrdinalIgnoreCase))
            .WithMessage("Status must be Pending, Confirmed, or Cancelled.");
    }
}
