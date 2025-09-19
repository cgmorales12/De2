using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GestionEmpleados.Models
{
    public class AsignacionModel
    {
        [Key]
        public int asignacion_id { get; set; }

        [Required]
        public int empleado_id { get; set; }

        [Required]
        public int departamento_id { get; set; }

        [Required]
        public DateTime fecha_asignacion { get; set; } = DateTime.Now;

        [StringLength(20)]
        public string estado { get; set; } = "Activa";

        // Relaciones
        [ForeignKey("empleado_id")]
        public virtual EmpleadoModel Empleado { get; set; }

        [ForeignKey("departamento_id")]
        public virtual DepartamentoModel Departamento { get; set; }
    }
}
