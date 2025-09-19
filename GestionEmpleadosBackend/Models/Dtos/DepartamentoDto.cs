// DepartamentoDto.cs
namespace GestionEmpleados.Models.Dtos
{
    public class DepartamentoDto
    {
        public int departamento_id { get; set; }
        public string nombre { get; set; }
        public string ubicacion { get; set; }
        public string jefe_departamento { get; set; }
        public string extension { get; set; }
        public int total_empleados { get; set; } = 0;
    }

    public class CreateDepartamentoDto
    {
        public string nombre { get; set; }
        public string ubicacion { get; set; }
        public string jefe_departamento { get; set; }
        public string extension { get; set; }
    }

    public class UpdateDepartamentoDto
    {
        public string nombre { get; set; }
        public string ubicacion { get; set; }
        public string jefe_departamento { get; set; }
        public string extension { get; set; }
    }
}
