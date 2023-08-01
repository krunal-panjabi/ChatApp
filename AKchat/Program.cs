using dataRepository.Interface;
using dataRepository.Repository;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin",
        builder =>
        {
            builder.AllowAnyOrigin() // Update with your Angular app's URL
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});


builder.Services.AddControllers();

builder.Services.AddScoped<IUserRepository, UserRepository>();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("AllowOrigin");
app.MapControllers();

app.Run();
