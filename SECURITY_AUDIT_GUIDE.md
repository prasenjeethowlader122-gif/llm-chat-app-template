# Laravel Security Audit Guide

This guide provides a comprehensive overview of how to perform a security audit on a Laravel application. It covers common vulnerabilities, configuration best practices, and recommended tools.

## 1. Automated Dependency Scanning

The first step in any audit is checking for known vulnerabilities in your project's dependencies.

*   **Composer Audit**: Run `composer audit` to check your `composer.lock` against the PHP Security Advisories Database.
*   **Enlightn**: A security and performance tool for Laravel that provides over 120 checks.
*   **Local PHP Security Checker**: A standalone binary that checks if your dependencies have any known security vulnerabilities.

## 2. Configuration Review

Incorrect configuration is a frequent source of security breaches.

*   **APP_DEBUG**: Ensure `APP_DEBUG=false` in production. If set to true, it can expose sensitive environment variables and stack traces.
*   **APP_KEY**: Ensure a strong application key is set (`php artisan key:generate`). This key is used for encryption.
*   **Session Security**:
    *   `SESSION_SECURE_COOKIE=true` (ensures cookies are only sent over HTTPS).
    *   `SESSION_HTTP_ONLY=true` (prevents JavaScript access to cookies).
*   **Environment Variables**: Never commit your `.env` file to version control. Use `.env.example` as a template.

## 3. Common Vulnerabilities & Remediation

### SQL Injection
Laravel's Eloquent ORM and Query Builder use PDO parameter binding by default, which protects against SQL injection. However, vulnerabilities can still be introduced if you use `DB::raw()` or `whereRaw()` with unvalidated user input.

*   **Bad**: `DB::table('users')->whereRaw("name = '$request->name'")->get();`
*   **Good**: `DB::table('users')->where('name', $request->name)->get();`

### Cross-Site Scripting (XSS)
Blade templates automatically escape variables using `{{ $var }}`. Only use `{!! $var !!}` when you are certain the content is safe and has been sanitized.

### Cross-Site Request Forgery (CSRF)
Ensure the `@csrf` directive is included in all your HTML forms. Laravel's `VerifyCsrfToken` middleware handles the validation.

### Mass Assignment
Avoid using `$guarded = []` in your models. Always explicitly define allowed attributes using `$fillable`.

*   **Recommended**: Use **Form Requests** to validate and authorize data before it reaches your controller.

## 4. Advanced Auditing Tools

For a deeper dive, consider these advanced static analysis and auditing tools:

*   **Larastan**: A PHPStan wrapper for Laravel that finds bugs and security issues through static analysis.
*   **Ward**: A security scanner built for Laravel that detects misconfigurations and exposed secrets.
*   **Pest Security Plugin**: If you use Pest, there are plugins available to run security checks during your test suite.

## 5. Security Checklist

- [ ] `APP_DEBUG` is set to `false` in production.
- [ ] `composer audit` passes with no critical vulnerabilities.
- [ ] All forms use `@csrf`.
- [ ] Models use `$fillable` instead of `$guarded = []`.
- [ ] User input is validated using Form Requests.
- [ ] Sensitive data is encrypted using Laravel's `Crypt` facade.
- [ ] Rate limiting is applied to authentication and sensitive API routes.
