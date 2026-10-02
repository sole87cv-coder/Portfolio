// Servidor mínimo: apenas serve os arquivos estáticos de wwwroot.
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();   // index.html como página inicial
app.UseStaticFiles();    // css, js, imagens

app.Run();
