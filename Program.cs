using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MyPage.Data;

var builder = WebApplication.CreateBuilder(args);

// Configure for production port binding
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

builder.Services.AddDbContext<MyPageContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyPageContext") ?? throw new InvalidOperationException("Connection string 'MyPageContext' not found.")));

// Add services to the container.
builder.Services.AddControllersWithViews()
    .AddRazorRuntimeCompilation();

// Add Unity game service
builder.Services.AddSingleton<MyPage.Services.IUnityGameService, MyPage.Services.UnityGameService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// Remove HTTPS redirection for Digital Ocean (they handle SSL at load balancer level)
if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Configure static files for Unity WebGL
var provider = new FileExtensionContentTypeProvider();

// MIME types
provider.Mappings[".data"] = "application/octet-stream";
provider.Mappings[".wasm"] = "application/wasm";
provider.Mappings[".js"] = "application/javascript";
provider.Mappings[".json"] = "application/json";
provider.Mappings[".br"] = "application/octet-stream";
provider.Mappings[".gz"] = "application/octet-stream";

app.UseStaticFiles(new StaticFileOptions
{
    ContentTypeProvider = provider,
    OnPrepareResponse = ctx =>
    {
        var requestPath = ctx.Context.Request.Path.Value?.ToLower() ?? "";
        var fileName = Path.GetFileName(requestPath);

        // Brotli files - .br extension
        if (requestPath.EndsWith(".br"))
        {
            // Set Content-Type based on actual file type
            if (fileName.Contains(".wasm.br"))
            {
                ctx.Context.Response.ContentType = "application/wasm";
            }
            else if (fileName.Contains(".js.br") || fileName.Contains(".framework"))
            {
                ctx.Context.Response.ContentType = "application/javascript";
            }
            else if (fileName.Contains(".data.br"))
            {
                ctx.Context.Response.ContentType = "application/octet-stream";
            }

            // CRITICAL: Tell browser the content is Brotli compressed
            ctx.Context.Response.Headers.Append("Content-Encoding", "br");
            
            // Debug log
            if (app.Environment.IsDevelopment())
            {
                var logger = ctx.Context.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogInformation("Serving .br file: {FileName}, Content-Type: {ContentType}, Content-Encoding: br",
                    fileName,
                    ctx.Context.Response.ContentType);
            }
        }
        // Gzip files - .gz extension
        else if (requestPath.EndsWith(".gz"))
        {
            if (fileName.Contains(".wasm.gz"))
            {
                ctx.Context.Response.ContentType = "application/wasm";
            }
            else if (fileName.Contains(".js.gz") || fileName.Contains(".framework"))
            {
                ctx.Context.Response.ContentType = "application/javascript";
            }
            else if (fileName.Contains(".data.gz"))
            {
                ctx.Context.Response.ContentType = "application/octet-stream";
            }

            ctx.Context.Response.Headers.Append("Content-Encoding", "gzip");
        }

        // Cache headers for games
        if (requestPath.Contains("/build/") || requestPath.Contains("/games/"))
        {
            ctx.Context.Response.Headers.Append("Cache-Control", "public, max-age=31536000, immutable");
        }
    }
});

app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();