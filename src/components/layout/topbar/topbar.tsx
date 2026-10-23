import Image from "next/image";
import appearanceIcon from "../../../../design-reference/references/Vector(1).png";
import notificationDefaultIcon from "../../../../design-reference/references/Group 1(1).png";
import notificationUnreadIcon from "../../../../design-reference/references/Group 1 (1)(1).png";
import { MaterialKeyboardArrowDownIcon } from "./material-icons";
import styles from "./topbar.module.css";

// Notifications have no backend yet; retain the unread reference state without fabricating an inbox.
const hasUnreadNotifications = true;

export function Topbar() {
  return (
    <header className={styles.topbar}>
      <nav aria-label="Dashboard utilities" className={styles.controls}>
        <button
          aria-disabled="true"
          aria-label="Notifications"
          className={styles.iconButton}
          title="Notifications preview"
          type="button"
        >
          <Image
            alt=""
            aria-hidden="true"
            className={styles.topbarIconImage}
            src={hasUnreadNotifications ? notificationUnreadIcon : notificationDefaultIcon}
          />
          <span className={styles.visuallyHidden}>Preview only</span>
        </button>

        <button
          aria-disabled="true"
          aria-label="Appearance settings"
          className={styles.iconButton}
          title="Appearance settings preview"
          type="button"
        >
          <Image
            alt=""
            aria-hidden="true"
            className={styles.topbarIconImage}
            src={appearanceIcon}
          />
          <span className={styles.visuallyHidden}>Preview only</span>
        </button>

        <button
          aria-disabled="true"
          aria-label="Admin profile menu"
          className={styles.profileButton}
          title="Admin profile menu preview"
          type="button"
        >
          {/* A real profile photo is not supplied as an approved reusable asset. */}
          <span aria-hidden="true" className={styles.avatar}>
            A
          </span>
          <span className={styles.profileDetails}>
            <span className={styles.profileName}>Admin</span>
            <span className={styles.profileRole}>Super Admin</span>
          </span>
          <MaterialKeyboardArrowDownIcon aria-hidden="true" className={styles.profileChevron} />
          <span className={styles.visuallyHidden}>Preview only</span>
        </button>
      </nav>
    </header>
  );
}
