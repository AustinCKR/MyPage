using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using MyPage.Data;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
// Change 0.0.0.0 to localhost for local host
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

builder.Services.AddDbContext<MyPageContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyPageContext") ?? throw new InvalidOperationException("Connection string 'MyPageContext' not found.")));

// Add services to the container.
builder.Services.AddControllersWithViews()
    .AddRazorRuntimeCompilation();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();