using Microsoft.AspNetCore.StaticFiles;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews()
    .AddRazorRuntimeCompilation(); // Enable hot reload for MVC views

// Add Unity game service
builder.Services.AddSingleton<MyPage.Services.IUnityGameService, MyPage.Services.UnityGameService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

// Configure static files to serve Unity WebGL files correctly
var provider = new FileExtensionContentTypeProvider();

// Add MIME types for Unity WebGL files (uncompressed)
provider.Mappings[".data"] = "application/octet-stream";
provider.Mappings[".wasm"] = "application/wasm";
provider.Mappings[".symbols.json"] = "application/octet-stream";
provider.Mappings[".json"] = "application/json";
provider.Mappings[".js"] = "application/javascript";

app.UseStaticFiles(new StaticFileOptions
{
    ContentTypeProvider = provider,
    OnPrepareResponse = ctx =>
    {
        var requestPath = ctx.Context.Request.Path.Value?.ToLower() ?? "";
        var fileName = Path.GetFileName(requestPath);

        // Handle gzip compressed files
        if (requestPath.EndsWith(".gz"))
        {
            // Set correct Content-Type based on the full filename BEFORE adding Content-Encoding
            if (fileName.EndsWith(".wasm.gz"))
            {
                ctx.Context.Response.ContentType = "application/wasm";
            }
            else if (fileName.EndsWith(".js.gz") || fileName.EndsWith(".loader.js.gz"))
            {
                ctx.Context.Response.ContentType = "application/javascript";
            }
            else if (fileName.EndsWith(".data.gz"))
            {
                ctx.Context.Response.ContentType = "application/octet-stream";
            }
            else if (fileName.EndsWith(".symbols.json.gz"))
            {
                ctx.Context.Response.ContentType = "application/octet-stream";
            }

            // Add Content-Encoding header
            ctx.Context.Response.Headers.Append("Content-Encoding", "gzip");

            // Debug logging
            if (app.Environment.IsDevelopment() && fileName.EndsWith(".wasm.gz"))
            {
                var logger = ctx.Context.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogInformation("Serving {FileName}: Content-Type={ContentType}, Content-Encoding={Encoding}",
                    fileName,
                    ctx.Context.Response.ContentType,
                    ctx.Context.Response.Headers["Content-Encoding"].ToString());
            }
        }

        // Handle Brotli compressed files
        else if (requestPath.EndsWith(".br"))
        {
            if (fileName.EndsWith(".wasm.br"))
            {
                ctx.Context.Response.ContentType = "application/wasm";
            }
            else if (fileName.EndsWith(".js.br"))
            {
                ctx.Context.Response.ContentType = "application/javascript";
            }
            else if (fileName.EndsWith(".data.br"))
            {
                ctx.Context.Response.ContentType = "application/octet-stream";
            }

            ctx.Context.Response.Headers.Append("Content-Encoding", "br");
        }

        // Add caching for Unity build files (improves performance)
        if (requestPath.Contains("/build/") || requestPath.Contains("/games/"))
        {
            ctx.Context.Response.Headers.Append("Cache-Control", "public, max-age=31536000");
        }
    }
});

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();