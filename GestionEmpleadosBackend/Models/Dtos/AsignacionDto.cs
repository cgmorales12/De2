// AsignacionDto.cs
namespace GestionEmpleados.Models.Dtos
{
    public class AsignacionDto
    {
        public int asignacion_id { get; set; }
        public int empleado_id { get; set; }
        public int departamento_id { get; set; }
        public DateTime fecha_asignacion { get; set; }
        public string estado { get; set; }

        // Datos adicionales para mostrar
        public string empleado_nombre_completo { get; set; }
        public string departamento_nombre { get; set; }
    }

    public class CreateAsignacionDto
    {
        public int empleado_id { get; set; }
        public int departamento_id { get; set; }
    }

    public class UpdateAsignacionDto
    {
        public string estado { get; set; }
    }
}
