namespace SocialApp.Application.Authentication.PasswordValidation;

public static class PasswordValidator
{
    public const int MinimumLength = 8;

    public static PasswordValidationResult Validate(
        string? password)
    {
        if (string.IsNullOrEmpty(password))
        {
            return PasswordValidationResult.Failure("Password is required.");
        }

        var errors = new List<string>();

        if (password.Length < MinimumLength)
        {
            errors.Add($"Password must be at least {MinimumLength} characters long.");
        }

        if (!password.Any(char.IsUpper))
        {
            errors.Add("Password must contain at least one uppercase letter.");
        }

        if (!password.Any(char.IsLower))
        {
            errors.Add("Password must contain at least one lowercase letter.");
        }

        if (!password.Any(char.IsDigit))
        {
            errors.Add("Password must contain at least one number.");
        }

        if (!password.Any(IsSpecialCharacter))
        {
            errors.Add("Password must contain at least one special character.");
        }

        return errors.Count > 0
            ? PasswordValidationResult.Failure(errors)
            : PasswordValidationResult.Success();
    }

    private static bool IsSpecialCharacter(char character)
    {
        return !char.IsLetterOrDigit(character)
               && !char.IsWhiteSpace(character);
    }
}

public sealed class PasswordValidationResult
{
    private PasswordValidationResult(
        bool isValid,
        IReadOnlyList<string> errors)
    {
        IsValid = isValid;
        Errors = errors;
    }

    public bool IsValid { get; }

    public IReadOnlyList<string> Errors { get; }

    public static PasswordValidationResult Success()
    {
        return new PasswordValidationResult(
            true,
            []);
    }

    public static PasswordValidationResult Failure(
        string error)
    {
        return new PasswordValidationResult(
            false,
            [error]);
    }

    public static PasswordValidationResult Failure(
        IReadOnlyList<string> errors)
    {
        return new PasswordValidationResult(
            false,
            errors);
    }
}