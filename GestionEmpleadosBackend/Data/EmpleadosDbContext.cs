using Microsoft.EntityFrameworkCore;
using GestionEmpleados.Models;

namespace GestionEmpleados.Data
{
    public class EmpleadosDbContext : DbContext
    {
        public EmpleadosDbContext(DbContextOptions<EmpleadosDbContext> options) : base(options)
        {
        }

        // DbSets para las tablas
        public DbSet<DepartamentoModel> Departamentos { get; set; }
        public DbSet<EmpleadoModel> Empleados { get; set; }
        public DbSet<AsignacionModel> Asignaciones { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración de la tabla Departamentos
            modelBuilder.Entity<DepartamentoModel>(entity =>
            {
                entity.ToTable("Departamentos");
                entity.HasKey(d => d.departamento_id);
                entity.Property(d => d.nombre).IsRequired().HasMaxLength(100);
                entity.Property(d => d.ubicacion).IsRequired().HasMaxLength(200);
                entity.Property(d => d.jefe_departamento).HasMaxLength(100);
                entity.Property(d => d.extension).HasMaxLength(20);

                // Índice único para nombre de departamento
                entity.HasIndex(d => d.nombre).IsUnique();
            });

            // Configuración de la tabla Empleados
            modelBuilder.Entity<EmpleadoModel>(entity =>
            {
                entity.ToTable("Empleados");
                entity.HasKey(e => e.empleado_id);
                entity.Property(e => e.nombre).IsRequired().HasMaxLength(50);
                entity.Property(e => e.apellido).IsRequired().HasMaxLength(50);
                entity.Property(e => e.email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.telefono).HasMaxLength(15);

                // Índice único para email
                entity.HasIndex(e => e.email).IsUnique();
            });

            // Configuración de la tabla Asignaciones
            modelBuilder.Entity<AsignacionModel>(entity =>
            {
                entity.ToTable("Asignaciones");
                entity.HasKey(a => a.asignacion_id);
                entity.Property(a => a.estado).HasMaxLength(20).HasDefaultValue("Activa");

                // Relaciones
                entity.HasOne(a => a.Empleado)
                    .WithMany(e => e.Asignaciones)
                    .HasForeignKey(a => a.empleado_id)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(a => a.Departamento)
                    .WithMany(d => d.Asignaciones)
                    .HasForeignKey(a => a.departamento_id)
                    .OnDelete(DeleteBehavior.Cascade);

                // Evitar asignaciones duplicadas activas (mismo empleado en mismo departamento)
                entity.HasIndex(a => new { a.empleado_id, a.departamento_id, a.estado })
                    .HasDatabaseName("IX_Empleado_Departamento_Estado");
            });
        }
    }
}