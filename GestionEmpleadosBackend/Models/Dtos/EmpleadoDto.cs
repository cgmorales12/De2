// EmpleadoDto.cs
namespace GestionEmpleados.Models.Dtos
{
    public class EmpleadoDto
    {
        public int empleado_id { get; set; }
        public string nombre { get; set; }
        public string apellido { get; set; }
        public string email { get; set; }
        public string telefono { get; set; }
        public string nombre_completo => $"{nombre} {apellido}";
    }

    public class CreateEmpleadoDto
    {
        public string nombre { get; set; }
        public string apellido { get; set; }
        public string email { get; set; }
        public string telefono { get; set; }
    }

    public class UpdateEmpleadoDto
    {
        public string nombre { get; set; }
        public string apellido { get; set; }
        public string email { get; set; }
        public string telefono { get; set; }
    }
}

