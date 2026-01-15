import TimelineCard from "./TimeLineCard";
import "./../styles/timeline.css";
import { motion } from "framer-motion";

export default function TimelineSection({ title, items }) {
  return (
    <section className="timelineSection">
      <div className="timelineHeader">
        <h2 className="timelineTitle">{title}</h2>
      </div>

      <div className="timelineGrid">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: index * 0.08,
              ease: "easeOut",
            }}
          >
            <TimelineCard item={item} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
