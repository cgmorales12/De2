using System.ComponentModel.DataAnnotations;

namespace GestionEmpleados.Models
{
    public class EmpleadoModel
    {
        [Key]
        public int empleado_id { get; set; }

        [Required]
        [StringLength(50)]
        public string nombre { get; set; }

        [Required]
        [StringLength(50)]
        public string apellido { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string email { get; set; }

        [StringLength(15)]
        public string telefono { get; set; }

        // Relación con asignaciones
        public virtual ICollection<AsignacionModel> Asignaciones { get; set; } = new List<AsignacionModel>();
    }
}