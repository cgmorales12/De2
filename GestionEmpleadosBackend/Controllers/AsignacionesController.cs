using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionEmpleados.Data;
using GestionEmpleados.Models;
using GestionEmpleados.Models.Dtos;

namespace GestionEmpleados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AsignacionesController : ControllerBase
    {
        private readonly EmpleadosDbContext _context;

        public AsignacionesController(EmpleadosDbContext context)
        {
            _context = context;
        }

        // GET: api/Asignaciones
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AsignacionDto>>> GetAsignaciones()
        {
            var asignaciones = await _context.Asignaciones
                .Include(a => a.Empleado)
                .Include(a => a.Departamento)
                .Select(a => new AsignacionDto
                {
                    asignacion_id = a.asignacion_id,
                    empleado_id = a.empleado_id,
                    departamento_id = a.departamento_id,
                    fecha_asignacion = a.fecha_asignacion,
                    estado = a.estado,
                    empleado_nombre_completo = a.Empleado.nombre + " " + a.Empleado.apellido,
                    departamento_nombre = a.Departamento.nombre
                })
                .ToListAsync();

            return Ok(asignaciones);
        }

        // GET: api/Asignaciones/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AsignacionDto>> GetAsignacion(int id)
        {
            var asignacion = await _context.Asignaciones
                .Include(a => a.Empleado)
                .Include(a => a.Departamento)
                .Where(a => a.asignacion_id == id)
                .Select(a => new AsignacionDto
                {
                    asignacion_id = a.asignacion_id,
                    empleado_id = a.empleado_id,
                    departamento_id = a.departamento_id,
                    fecha_asignacion = a.fecha_asignacion,
                    estado = a.estado,
                    empleado_nombre_completo = a.Empleado.nombre + " " + a.Empleado.apellido,
                    departamento_nombre = a.Departamento.nombre
                })
                .FirstOrDefaultAsync();

            if (asignacion == null)
            {
                return NotFound();
            }

            return Ok(asignacion);
        }

        // GET: api/Asignaciones/departamento/5
        [HttpGet("departamento/{departamentoId}")]
        public async Task<ActionResult<IEnumerable<AsignacionDto>>> GetAsignacionesPorDepartamento(int departamentoId)
        {
            var asignaciones = await _context.Asignaciones
                .Include(a => a.Empleado)
                .Include(a => a.Departamento)
                .Where(a => a.departamento_id == departamentoId)
                .Select(a => new AsignacionDto
                {
                    asignacion_id = a.asignacion_id,
                    empleado_id = a.empleado_id,
                    departamento_id = a.departamento_id,
                    fecha_asignacion = a.fecha_asignacion,
                    estado = a.estado,
                    empleado_nombre_completo = a.Empleado.nombre + " " + a.Empleado.apellido,
                    departamento_nombre = a.Departamento.nombre
                })
                .ToListAsync();

            return Ok(asignaciones);
        }

        // GET: api/Asignaciones/empleado/5
        [HttpGet("empleado/{empleadoId}")]
        public async Task<ActionResult<IEnumerable<AsignacionDto>>> GetAsignacionesPorEmpleado(int empleadoId)
        {
            var asignaciones = await _context.Asignaciones
                .Include(a => a.Empleado)
                .Include(a => a.Departamento)
                .Where(a => a.empleado_id == empleadoId)
                .Select(a => new AsignacionDto
                {
                    asignacion_id = a.asignacion_id,
                    empleado_id = a.empleado_id,
                    departamento_id = a.departamento_id,
                    fecha_asignacion = a.fecha_asignacion,
                    estado = a.estado,
                    empleado_nombre_completo = a.Empleado.nombre + " " + a.Empleado.apellido,
                    departamento_nombre = a.Departamento.nombre
                })
                .ToListAsync();

            return Ok(asignaciones);
        }

        // POST: api/Asignaciones
        [HttpPost]
        public async Task<ActionResult<AsignacionDto>> CreateAsignacion(CreateAsignacionDto createAsignacionDto)
        {
            // Verificar que existe el departamento
            var departamento = await _context.Departamentos.FindAsync(createAsignacionDto.departamento_id);
            if (departamento == null)
            {
                return BadRequest("El departamento especificado no existe");
            }

            // Verificar que existe el empleado
            var empleado = await _context.Empleados.FindAsync(createAsignacionDto.empleado_id);
            if (empleado == null)
            {
                return BadRequest("El empleado especificado no existe");
            }

            // Verificar que no exista ya una asignación activa para este empleado en este departamento
            var asignacionExistente = await _context.Asignaciones
                .AnyAsync(a => a.empleado_id == createAsignacionDto.empleado_id
                            && a.departamento_id == createAsignacionDto.departamento_id
                            && a.estado == "Activa");

            if (asignacionExistente)
            {
                return BadRequest("El empleado ya está asignado a este departamento");
            }

            var asignacion = new AsignacionModel
            {
                empleado_id = createAsignacionDto.empleado_id,
                departamento_id = createAsignacionDto.departamento_id,
                fecha_asignacion = DateTime.Now,
                estado = "Activa"
            };

            _context.Asignaciones.Add(asignacion);
            await _context.SaveChangesAsync();

            // Cargar los datos relacionados para la respuesta
            asignacion = await _context.Asignaciones
                .Include(a => a.Empleado)
                .Include(a => a.Departamento)
                .FirstAsync(a => a.asignacion_id == asignacion.asignacion_id);

            var asignacionDto = new AsignacionDto
            {
                asignacion_id = asignacion.asignacion_id,
                empleado_id = asignacion.empleado_id,
                departamento_id = asignacion.departamento_id,
                fecha_asignacion = asignacion.fecha_asignacion,
                estado = asignacion.estado,
                empleado_nombre_completo = asignacion.Empleado.nombre + " " + asignacion.Empleado.apellido,
                departamento_nombre = asignacion.Departamento.nombre
            };

            return CreatedAtAction(nameof(GetAsignacion), new { id = asignacion.asignacion_id }, asignacionDto);
        }

        // PUT: api/Asignaciones/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsignacion(int id, UpdateAsignacionDto updateAsignacionDto)
        {
            var asignacion = await _context.Asignaciones.FindAsync(id);

            if (asignacion == null)
            {
                return NotFound();
            }

            asignacion.estado = updateAsignacionDto.estado;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AsignacionExists(id))
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

        // DELETE: api/Asignaciones/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsignacion(int id)
        {
            var asignacion = await _context.Asignaciones.FindAsync(id);
            if (asignacion == null)
            {
                return NotFound();
            }

            _context.Asignaciones.Remove(asignacion);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AsignacionExists(int id)
        {
            return _context.Asignaciones.Any(a => a.asignacion_id == id);
        }
    }
}
