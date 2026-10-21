function PriorityBadge({ priority }) {

  const styles = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

export default PriorityBadge;