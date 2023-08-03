using AKchat.Hubs;
using AKchat.Services;
using dataRepository.Interface;
using dataRepository.Repository;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

/*builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin",
        builder =>
        {
            builder.AllowAnyOrigin() // Update with your Angular app's URL
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});*/


builder.Services.AddControllers();

builder.Services.AddScoped<IUserRepository, UserRepository>();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<ChatServices>();
builder.Services.AddSignalR();
/*builder.Services.AddCors();*/


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:4200"));

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");
app.Run();
