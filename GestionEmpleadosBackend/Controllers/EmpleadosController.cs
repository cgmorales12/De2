using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionEmpleados.Data;
using GestionEmpleados.Models;
using GestionEmpleados.Models.Dtos;

namespace GestionEmpleados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpleadosController : ControllerBase
    {
        private readonly EmpleadosDbContext _context;

        public EmpleadosController(EmpleadosDbContext context)
        {
            _context = context;
        }

        // GET: api/Empleados
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmpleadoDto>>> GetEmpleados()
        {
            var empleados = await _context.Empleados
                .Select(e => new EmpleadoDto
                {
                    empleado_id = e.empleado_id,
                    nombre = e.nombre,
                    apellido = e.apellido,
                    email = e.email,
                    telefono = e.telefono
                })
                .ToListAsync();

            return Ok(empleados);
        }

        // GET: api/Empleados/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EmpleadoDto>> GetEmpleado(int id)
        {
            var empleado = await _context.Empleados
                .Where(e => e.empleado_id == id)
                .Select(e => new EmpleadoDto
                {
                    empleado_id = e.empleado_id,
                    nombre = e.nombre,
                    apellido = e.apellido,
                    email = e.email,
                    telefono = e.telefono
                })
                .FirstOrDefaultAsync();

            if (empleado == null)
            {
                return NotFound();
            }

            return Ok(empleado);
        }

        // GET: api/Empleados/sin-asignar
        [HttpGet("sin-asignar")]
        public async Task<ActionResult<IEnumerable<EmpleadoDto>>> GetEmpleadosSinAsignar()
        {
            var empleadosSinAsignar = await _context.Empleados
                .Where(e => !e.Asignaciones.Any(a => a.estado == "Activa"))
                .Select(e => new EmpleadoDto
                {
                    empleado_id = e.empleado_id,
                    nombre = e.nombre,
                    apellido = e.apellido,
                    email = e.email,
                    telefono = e.telefono
                })
                .ToListAsync();

            return Ok(empleadosSinAsignar);
        }

        // POST: api/Empleados
        [HttpPost]
        public async Task<ActionResult<EmpleadoDto>> CreateEmpleado(CreateEmpleadoDto createEmpleadoDto)
        {
            // Verificar si el email ya existe
            var existeEmail = await _context.Empleados
                .AnyAsync(e => e.email == createEmpleadoDto.email);

            if (existeEmail)
            {
                return BadRequest("Ya existe un empleado con este email");
            }

            var empleado = new EmpleadoModel
            {
                nombre = createEmpleadoDto.nombre,
                apellido = createEmpleadoDto.apellido,
                email = createEmpleadoDto.email,
                telefono = createEmpleadoDto.telefono
            };

            _context.Empleados.Add(empleado);
            await _context.SaveChangesAsync();

            var empleadoDto = new EmpleadoDto
            {
                empleado_id = empleado.empleado_id,
                nombre = empleado.nombre,
                apellido = empleado.apellido,
                email = empleado.email,
                telefono = empleado.telefono
            };

            return CreatedAtAction(nameof(GetEmpleado), new { id = empleado.empleado_id }, empleadoDto);
        }

        // PUT: api/Empleados/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmpleado(int id, UpdateEmpleadoDto updateEmpleadoDto)
        {
            var empleado = await _context.Empleados.FindAsync(id);

            if (empleado == null)
            {
                return NotFound();
            }

            // Verificar si el nuevo email ya existe (excepto para el mismo empleado)
            var existeEmail = await _context.Empleados
                .AnyAsync(e => e.email == updateEmpleadoDto.email && e.empleado_id != id);

            if (existeEmail)
            {
                return BadRequest("Ya existe un empleado con este email");
            }

            empleado.nombre = updateEmpleadoDto.nombre;
            empleado.apellido = updateEmpleadoDto.apellido;
            empleado.email = updateEmpleadoDto.email;
            empleado.telefono = updateEmpleadoDto.telefono;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmpleadoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Empleados/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmpleado(int id)
        {
            var empleado = await _context.Empleados.FindAsync(id);
            if (empleado == null)
            {
                return NotFound();
            }

            _context.Empleados.Remove(empleado);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EmpleadoExists(int id)
        {
            return _context.Empleados.Any(e => e.empleado_id == id);
        }
    }
}
