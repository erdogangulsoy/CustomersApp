using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Serilog;
using Microsoft.Extensions.Configuration;

namespace CustomersApp
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;

        }

        public void ConfigureServices(IServiceCollection services)
        {
            //Razor page
            services.AddAntiforgery(o => o.HeaderName = "X-CSRF-TOKEN");
            services.AddRazorPages();
            //services.AddTransient<IMailService>(m => new MailService(Configuration["SendGridApiKey"]));
           
        }


        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseForwardedHeaders();
            app.UseSerilogRequestLogging();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
            });
        }
    }
}
