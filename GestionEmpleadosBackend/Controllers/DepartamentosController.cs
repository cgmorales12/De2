using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestionEmpleados.Data;
using GestionEmpleados.Models;
using GestionEmpleados.Models.Dtos;

namespace GestionEmpleados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartamentosController : ControllerBase
    {
        private readonly EmpleadosDbContext _context;

        public DepartamentosController(EmpleadosDbContext context)
        {
            _context = context;
        }

        // GET: api/Departamentos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartamentoDto>>> GetDepartamentos()
        {
            var departamentos = await _context.Departamentos
                .Include(d => d.Asignaciones)
                .Select(d => new DepartamentoDto
                {
                    departamento_id = d.departamento_id,
                    nombre = d.nombre,
                    ubicacion = d.ubicacion,
                    jefe_departamento = d.jefe_departamento,
                    extension = d.extension,
                    total_empleados = d.Asignaciones.Count(a => a.estado == "Activa")
                })
                .ToListAsync();

            return Ok(departamentos);
        }

        // GET: api/Departamentos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DepartamentoDto>> GetDepartamento(int id)
        {
            var departamento = await _context.Departamentos
                .Include(d => d.Asignaciones)
                .Where(d => d.departamento_id == id)
                .Select(d => new DepartamentoDto
                {
                    departamento_id = d.departamento_id,
                    nombre = d.nombre,
                    ubicacion = d.ubicacion,
                    jefe_departamento = d.jefe_departamento,
                    extension = d.extension,
                    total_empleados = d.Asignaciones.Count(a => a.estado == "Activa")
                })
                .FirstOrDefaultAsync();

            if (departamento == null)
            {
                return NotFound();
            }

            return Ok(departamento);
        }

        // POST: api/Departamentos
        [HttpPost]
        public async Task<ActionResult<DepartamentoDto>> CreateDepartamento(CreateDepartamentoDto createDepartamentoDto)
        {
            // Verificar si el nombre ya existe
            var existeNombre = await _context.Departamentos
                .AnyAsync(d => d.nombre == createDepartamentoDto.nombre);

            if (existeNombre)
            {
                return BadRequest("Ya existe un departamento con este nombre");
            }

            var departamento = new DepartamentoModel
            {
                nombre = createDepartamentoDto.nombre,
                ubicacion = createDepartamentoDto.ubicacion,
                jefe_departamento = createDepartamentoDto.jefe_departamento,
                extension = createDepartamentoDto.extension
            };

            _context.Departamentos.Add(departamento);
            await _context.SaveChangesAsync();

            var departamentoDto = new DepartamentoDto
            {
                departamento_id = departamento.departamento_id,
                nombre = departamento.nombre,
                ubicacion = departamento.ubicacion,
                jefe_departamento = departamento.jefe_departamento,
                extension = departamento.extension,
                total_empleados = 0
            };

            return CreatedAtAction(nameof(GetDepartamento), new { id = departamento.departamento_id }, departamentoDto);
        }

        // PUT: api/Departamentos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartamento(int id, UpdateDepartamentoDto updateDepartamentoDto)
        {
            var departamento = await _context.Departamentos.FindAsync(id);

            if (departamento == null)
            {
                return NotFound();
            }

            // Verificar si el nuevo nombre ya existe (excepto para el mismo departamento)
            var existeNombre = await _context.Departamentos
                .AnyAsync(d => d.nombre == updateDepartamentoDto.nombre && d.departamento_id != id);

            if (existeNombre)
            {
                return BadRequest("Ya existe un departamento con este nombre");
            }

            departamento.nombre = updateDepartamentoDto.nombre;
            departamento.ubicacion = updateDepartamentoDto.ubicacion;
            departamento.jefe_departamento = updateDepartamentoDto.jefe_departamento;
            departamento.extension = updateDepartamentoDto.extension;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DepartamentoExists(id))
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

        // DELETE: api/Departamentos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartamento(int id)
        {
            var departamento = await _context.Departamentos.FindAsync(id);
            if (departamento == null)
            {
                return NotFound();
            }

            _context.Departamentos.Remove(departamento);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DepartamentoExists(int id)
        {
            return _context.Departamentos.Any(d => d.departamento_id == id);
        }
    }
}
