using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CustomersApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
             Host.CreateDefaultBuilder(args)
              .UseSerilog((context, services, configuration) => configuration
                 .MinimumLevel.Debug()
                 .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
                 .Enrich.FromLogContext()
                 .WriteTo.Console(theme: AnsiConsoleTheme.Code)
                 .WriteTo.File(@"logs\log.txt", rollingInterval: RollingInterval.Day))
                 .ConfigureWebHostDefaults(webBuilder =>
                 {
                     webBuilder.UseStartup<Startup>();
                 });
    }
}
