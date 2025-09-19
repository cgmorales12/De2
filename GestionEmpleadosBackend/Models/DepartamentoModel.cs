using System.ComponentModel.DataAnnotations;

namespace GestionEmpleados.Models
{
    public class DepartamentoModel
    {
        [Key]
        public int departamento_id { get; set; }

        [Required]
        [StringLength(100)]
        public string nombre { get; set; }

        [Required]
        [StringLength(200)]
        public string ubicacion { get; set; }

        [StringLength(100)]
        public string jefe_departamento { get; set; }

        [StringLength(20)]
        public string extension { get; set; }

        // Relación con asignaciones
        public virtual ICollection<AsignacionModel> Asignaciones { get; set; } = new List<AsignacionModel>();
    }
}