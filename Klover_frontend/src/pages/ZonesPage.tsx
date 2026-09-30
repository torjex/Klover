import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api, ApiError, num } from "../api/client";
import { useAsync } from "../hooks/useAsync";
import {
  Alert,
  Button,
  EmptyState,
  Icon,
  Modal,
  RowMenu,
  Skeleton,
  TextField,
  useToast,
} from "../components/ui";
import { formatWhenUtc } from "../lib/format";
import { PHOTO_ACCEPT, photoProblem, zoneImage, zonePhoto } from "../lib/zoneImages";
import type { Field, Schedule, Zone } from "../api/types";
import "./ZonesPage.css";

export function ZonesPage() {
  const toast = useToast();
  const zones = useAsync(() => api.zones(), [], { intervalMs: 20_000 });
  const schedules = useAsync(() => api.schedules(), []);
  const fields = useAsync(loadFields, []);

  const [editing, setEditing] = useState<Zone | null>(null);
  const [removing, setRemoving] = useState<Zone | null>(null);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const nextRunByZone = useMemo(
    () => nextRunPerZone(schedules.data ?? []),
    [schedules.data],
  );

  const fieldById = useMemo(() => {
    const map = new Map<string, Field>();
    for (const field of fields.data ?? []) map.set(String(field.id), field);
    return map;
  }, [fields.data]);

  const usedFieldIds = new Set(
    (zones.data ?? []).map((z) => z.field_id).filter(Boolean) as string[],
  );
  const availableFields = (fields.data ?? []).filter(
    (f) => !usedFieldIds.has(String(f.id)),
  );

  function refresh() {
    zones.reload();
    schedules.reload();
  }

  async function toggleEnabled(zone: Zone, enabled: boolean) {
    setBusyId(zone.id);
    try {
      await api.updateZone(zone.id, {
        name: zone.name,
        flowRateLpm: num(zone.flow_rate_lpm),
        enabled,
      });
      toast(`${zone.name} ${enabled ? "activated" : "paused"}.`);
      refresh();
    } catch (cause) {
      toast(
        cause instanceof ApiError ? cause.message : "Could not update the zone.",
        "error",
      );
    } finally {
      setBusyId(null);
    }
  }

  const list = zones.data ?? [];

  return (
    <>
      {zones.error ? (
        <div style={{ marginBottom: 16 }}>
          <Alert tone="error">{zones.error}</Alert>
        </div>
      ) : null}

      <section className="zpanel">
        <header className="zpanel__head">
          <span className="zpanel__mark">
            <Icon name="leaf" size={24} />
          </span>
          <div className="zpanel__heading">
            <h1 className="zpanel__title">Zones</h1>
            <p className="zpanel__subtitle">
              Manage your irrigation zones and monitor their status
            </p>
          </div>
          <div className="zpanel__actions">
            <button
              type="button"
              className="zbtn zbtn--primary"
              onClick={() => setCreating(true)}
            >
              <Icon name="plus" size={18} strokeWidth={2.2} />
              Add zone
            </button>
            <Link to="/map" className="zbtn zbtn--soft">
              <Icon name="map" size={18} />
              View on map
            </Link>
          </div>
        </header>

        <div className="ztable-wrap">
          <div className="ztable-scroll">
            <table className="ztable">
              <thead>
                <tr>
                  <th style={{ width: "36%" }}>Zone</th>
                  <th>Status</th>
                  <th>Flow rate</th>
                  <th>Next run</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {zones.initial ? (
                  [0, 1, 2].map((i) => (
                    <tr key={i}>
                      <td colSpan={5}>
                        <Skeleton height={58} />
                      </td>
                    </tr>
                  ))
                ) : list.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: 0 }}>
                      <div className="zpanel__empty">
                        <EmptyState
                          icon="zones"
                          title="No zones yet"
                          action={
                            <button
                              type="button"
                              className="zbtn zbtn--primary"
                              onClick={() => setCreating(true)}
                            >
                              <Icon name="plus" size={18} strokeWidth={2.2} />
                              Add zone
                            </button>
                          }
                        >
                          A zone links a garden area to a valve with a known flow rate.
                        </EmptyState>
                      </div>
                    </td>
                  </tr>
                ) : (
                  list.map((zone) => {
                    const field = zone.field_id
                      ? fieldById.get(String(zone.field_id))
                      : undefined;
                    const description =
                      zone.description ?? field?.crop_type ?? "Irrigation zone";
                    const next = nextRunByZone.get(zone.id) ?? null;
                    return (
                      <tr key={zone.id}>
                        <td>
                          <div className="zid">
                            <img
                              className="zid__thumb"
                              src={zonePhoto(zone)}
                              alt=""
                              loading="lazy"
                            />
                            <div style={{ minWidth: 0 }}>
                              <div className="zid__name">{zone.name}</div>
                              <div className="zid__desc">{description}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="zstatus"
                            data-on={zone.enabled}
                            role="switch"
                            aria-checked={zone.enabled}
                            aria-label={`${zone.name} is ${zone.enabled ? "active" : "paused"}`}
                            disabled={busyId === zone.id}
                            onClick={() => void toggleEnabled(zone, !zone.enabled)}
                          >
                            <span className="zstatus__track">
                              <span className="zstatus__thumb" />
                            </span>
                            <span className="zstatus__label">
                              {zone.enabled ? "Active" : "Paused"}
                            </span>
                          </button>
                        </td>
                        <td>
                          <div className="zcell">
                            <Icon
                              name="droplet"
                              size={20}
                              strokeWidth={1.7}
                              className="zcell__icon"
                            />
                            <span className="zcell__value">
                              {num(zone.flow_rate_lpm)} L/min
                            </span>
                          </div>
                        </td>
                        <td>
                          {next ? (
                            <div className="zcell">
                              <Icon
                                name="calendar"
                                size={20}
                                strokeWidth={1.7}
                                className="zcell__icon"
                              />
                              <div style={{ minWidth: 0 }}>
                                <div className="zcell__value">
                                  {formatWhenUtc(next)}
                                </div>
                                <div className="zcell__sub">{countdownTo(next)}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="zcell__muted">Not scheduled</span>
                          )}
                        </td>
                        <td>
                          <span className="zactions">
                            <RowMenu
                              label={`Actions for ${zone.name}`}
                              items={[
                                {
                                  label: "Edit zone",
                                  icon: "zones",
                                  onSelect: () => setEditing(zone),
                                },
                                {
                                  label: zone.enabled ? "Pause zone" : "Activate zone",
                                  icon: zone.enabled ? "close" : "check",
                                  onSelect: () =>
                                    void toggleEnabled(zone, !zone.enabled),
                                },
                                {
                                  label: "Remove zone",
                                  icon: "trash",
                                  danger: true,
                                  onSelect: () => setRemoving(zone),
                                },
                              ]}
                            />
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {creating ? (
        <ZoneDialog
          fields={availableFields}
          allFields={fields.data ?? []}
          fieldsLoading={fields.initial}
          onClose={() => setCreating(false)}
          onSaved={() => {
            setCreating(false);
            fields.reload();
            refresh();
          }}
        />
      ) : null}

      {removing ? (
        <RemoveZoneDialog
          zone={removing}
          onClose={() => setRemoving(null)}
          onRemoved={() => {
            setRemoving(null);
            fields.reload();
            refresh();
          }}
        />
      ) : null}

      {editing ? (
        <ZoneDialog
          zone={editing}
          fields={availableFields}
          allFields={fields.data ?? []}
          fieldsLoading={false}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
        />
      ) : null}
    </>
  );
}

/** Earliest upcoming occurrence for each zone, across its enabled schedules. */
export function nextRunPerZone(schedules: Schedule[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const schedule of schedules) {
    if (!schedule.enabled || !schedule.nextRunAt) continue;
    const current = map.get(schedule.zone_id);
    if (!current || Date.parse(schedule.nextRunAt) < Date.parse(current))
      map.set(schedule.zone_id, schedule.nextRunAt);
  }
  return map;
}

/** "in 2 h", "in 45 min" - the relative half of the next-run cell. */
export function countdownTo(iso: string): string {
  const seconds = Math.round((Date.parse(iso) - Date.now()) / 1000);
  if (seconds <= 0) return "due now";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours >= 24) {
    const days = Math.round(hours / 24);
    return `in ${days} day${days === 1 ? "" : "s"}`;
  }
  if (hours === 0) return `in ${Math.max(1, minutes)} min`;
  if (minutes === 0) return `in ${hours} h`;
  return `in ${hours} h ${minutes} min`;
}

function RemoveZoneDialog({
  zone,
  onClose,
  onRemoved,
}: {
  zone: Zone;
  onClose: () => void;
  onRemoved: () => void;
}) {
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    setError(null);
    try {
      await api.archiveZone(zone.id);
      toast(`${zone.name} removed.`);
      onRemoved();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not remove the zone.");
      setBusy(false);
    }
  }

  return (
    <Modal
      title={`Remove ${zone.name}?`}
      subtitle="The zone and its schedules leave the app."
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="danger" loading={busy} onClick={() => void remove()}>
            Remove zone
          </Button>
        </>
      }
    >
      {error ? (
        <div style={{ marginBottom: 14 }}>
          <Alert tone="error">{error}</Alert>
        </div>
      ) : null}
      <Alert tone="info">
        Past watering runs stay in your history and reports. The garden area is freed, so
        you can create a new zone for it.
      </Alert>
    </Modal>
  );
}

/** Zones belong to a field, so the picker needs every field across every farm. */
async function loadFields(): Promise<Field[]> {
  const farms = await api.farms();
  const lists = await Promise.all(farms.map((farm) => api.fields(String(farm.id))));
  return lists.flat();
}

function ZoneDialog({
  zone,
  fields,
  allFields,
  fieldsLoading,
  onClose,
  onSaved,
}: {
  zone?: Zone;
  /** Areas still free to take a new zone. */
  fields: Field[];
  /** Every area, including taken ones, so an existing zone can name its own. */
  allFields: Field[];
  fieldsLoading: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const editingExisting = !!zone;
  const [name, setName] = useState(zone?.name ?? "");
  const [flow, setFlow] = useState(zone ? String(num(zone.flow_rate_lpm)) : "10");
  const [fieldId, setFieldId] = useState(fields[0] ? String(fields[0].id) : "");
  const [newFieldName, setNewFieldName] = useState("");
  const [description, setDescription] = useState(zone?.description ?? "");
  const [color, setColor] = useState(zone?.color ?? ZONE_COLORS[0]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /*
   * The picked file is held until the zone is saved, so Cancel discards it and
   * a brand-new zone - which has no id to upload against yet - works the same
   * way as an existing one.
   */
  const photoRef = useRef<HTMLInputElement | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoCleared, setPhotoCleared] = useState(false);
  // The blob URL is derived from the pick; the effect exists only to release it.
  const photoPreview = useMemo(
    () => (photoFile ? URL.createObjectURL(photoFile) : null),
    [photoFile],
  );
  useEffect(
    () => () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    },
    [photoPreview],
  );

  const hasOwnPhoto = (!!zone?.photo_token && !photoCleared) || !!photoFile;
  const previewPhoto =
    photoPreview ??
    (zone && !photoCleared
      ? zonePhoto(zone)
      : zoneImage(zone?.id ?? (name.trim() || "New zone")));

  function pickPhoto(file: File | undefined) {
    if (!file) return;
    const problem = photoProblem(file);
    if (problem) return setError(problem);
    setError(null);
    setPhotoCleared(false);
    setPhotoFile(file);
  }

  function clearPhoto() {
    setPhotoFile(null);
    setPhotoCleared(true);
    if (photoRef.current) photoRef.current.value = "";
  }

  const creatingField = !editingExisting && (fields.length === 0 || fieldId === "__new");
  const describeField = (field: Field) =>
    `${field.name}${field.crop_type ? ` · ${field.crop_type}` : ""}`;
  /* An existing zone keeps its own area - it cannot be reassigned - while a new
   * one previews whichever area the picker is pointing at. */
  const areaField = editingExisting
    ? (allFields.find((item) => String(item.id) === String(zone?.field_id)) ?? null)
    : (fields.find((item) => String(item.id) === fieldId) ?? null);
  const flowValue = Number(flow);
  const previewName = name.trim() || "New zone";
  const previewArea = creatingField
    ? newFieldName.trim() || "A new garden area"
    : areaField
      ? describeField(areaField)
      : editingExisting
        ? null
        : "No garden area yet";

  async function save() {
    if (!name.trim()) return setError("Give the zone a name.");
    if (!Number.isFinite(flowValue) || flowValue <= 0)
      return setError("Flow rate must be a positive number of litres per minute.");

    setBusy(true);
    setError(null);
    try {
      let savedId = zone?.id ?? "";
      if (editingExisting) {
        await api.updateZone(zone!.id, {
          name: name.trim(),
          flowRateLpm: flowValue,
          description: description.trim() || undefined,
          color,
        });
      } else {
        let targetFieldId = fieldId;
        if (creatingField) {
          if (!newFieldName.trim()) throw new ApiError(400, "Name the new garden area.");
          const farms = await api.farms();
          const farm = farms[0] ?? (await api.createFarm({ name: "My garden" }));
          const field = await api.createField(String(farm.id), {
            name: name.trim(),
            cropType: newFieldName.trim(),
          });
          targetFieldId = String(field.id);
        }
        const created = await api.createZone({
          fieldId: targetFieldId,
          name: name.trim(),
          flowRateLpm: flowValue,
          enabled: true,
          description: description.trim() || undefined,
          color,
        });
        savedId = created.id;
      }

      /*
       * The picture is a separate upload. The zone itself is already saved by
       * this point, so a failure here is reported without discarding that.
       */
      try {
        if (photoFile) await api.uploadZonePhoto(savedId, photoFile);
        else if (photoCleared && zone?.photo_token) await api.deleteZonePhoto(savedId);
      } catch (cause) {
        toast(
          cause instanceof ApiError ? cause.message : "The image could not be saved.",
          "error",
        );
      }

      toast(editingExisting ? "Zone updated." : "Zone added.");
      onSaved();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not save the zone.");
      setBusy(false);
    }
  }

  return (
    <Modal
      size="xl"
      icon="leaf"
      title={editingExisting ? "Edit zone" : "Add zone"}
      subtitle={
        editingExisting
          ? "Update the zone name and its measured flow rate."
          : "A zone controls one valve and estimates water use from its flow rate."
      }
      onClose={onClose}
      footerLead={
        <Link
          to="/map"
          className="zdlg__learn"
          title="See how zones are traced on the garden map"
          onClick={onClose}
        >
          <Icon name="help" size={17} />
          Learn more about zones
        </Link>
      }
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            icon={editingExisting ? "check" : "plus"}
            loading={busy}
            onClick={() => void save()}
          >
            {editingExisting ? "Save changes" : "Add zone"}
          </Button>
        </>
      }
    >
      {error ? (
        <div style={{ marginBottom: 18 }}>
          <Alert tone="error">{error}</Alert>
        </div>
      ) : null}

      <div className="zdlg">
        {/* -- The form ------------------------------------------------- */}
        <div className="zdlg__form">
          <div className="field">
            <label className="field__label zdlg__label" htmlFor="zone-name">
              Zone name <span className="zdlg__req">*</span>
            </label>
            <div className="zdlg__control">
              <Icon name="leaf" size={18} className="zdlg__control-icon" />
              <input
                id="zone-name"
                className="input zdlg__input zdlg__input--iconed"
                placeholder="Front lawn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <p className="field__hint">Use a clear name to easily identify this zone.</p>
          </div>

          <div className="field">
            <label className="field__label zdlg__label" htmlFor="zone-flow">
              Flow rate (L/min) <span className="zdlg__req">*</span>
            </label>
            <div className="zdlg__control">
              <input
                id="zone-flow"
                className="input zdlg__input zdlg__input--stepped"
                type="number"
                min="0.1"
                step="0.1"
                value={flow}
                onChange={(e) => setFlow(e.target.value)}
              />
              <span className="zdlg__stepper">
                <button
                  type="button"
                  aria-label="Increase flow rate"
                  onClick={() => setFlow(stepFlow(flow, 1))}
                >
                  <Icon name="chevron-down" size={13} strokeWidth={2.4} />
                </button>
                <button
                  type="button"
                  aria-label="Decrease flow rate"
                  onClick={() => setFlow(stepFlow(flow, -1))}
                >
                  <Icon name="chevron-down" size={13} strokeWidth={2.4} />
                </button>
              </span>
            </div>
            <p className="field__hint">Used to estimate water consumption for every run.</p>
          </div>

          {!editingExisting ? (
            fieldsLoading ? (
              <div className="field">
                <Skeleton height={52} />
              </div>
            ) : (
              <>
                {fields.length > 0 ? (
                  <div className="field">
                    <label className="field__label zdlg__label" htmlFor="zone-area">
                      Garden area <span className="zdlg__req">*</span>
                    </label>
                    <div className="zdlg__control">
                      <Icon name="sprout" size={18} className="zdlg__control-icon" />
                      <select
                        id="zone-area"
                        className="select zdlg__input zdlg__input--iconed"
                        value={fieldId}
                        onChange={(e) => setFieldId(e.target.value)}
                      >
                        {fields.map((field) => (
                          <option key={field.id} value={String(field.id)}>
                            {field.name}
                            {field.crop_type ? ` · ${field.crop_type}` : ""}
                          </option>
                        ))}
                        <option value="__new">Create a new area…</option>
                      </select>
                    </div>
                    <p className="field__hint">Each area can hold one zone.</p>
                  </div>
                ) : null}

                {creatingField ? (
                  <TextField
                    label="Area description"
                    placeholder="Raised beds"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    hint={
                      fields.length
                        ? "Names the new area this zone is created in."
                        : "A matching garden area is created for this zone."
                    }
                  />
                ) : null}
              </>
            )
          ) : null}

          {/* -- Advanced ----------------------------------------------- */}
          <div className="zdlg__advanced" data-open={advancedOpen}>
            <button
              type="button"
              className="zdlg__advanced-toggle"
              aria-expanded={advancedOpen}
              onClick={() => setAdvancedOpen((open) => !open)}
            >
              <Icon
                name={advancedOpen ? "chevron-down" : "chevron-right"}
                size={18}
                className="zdlg__advanced-chevron"
              />
              <span>
                <span className="zdlg__advanced-title">Advanced settings</span>
                <span className="zdlg__advanced-sub">Description and map colour</span>
              </span>
            </button>

            {advancedOpen ? (
              <div className="zdlg__advanced-body">
                <TextField
                  label="Description"
                  placeholder="Lawn grass"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={200}
                  hint="Shown under the zone name across the app."
                />
                <div className="field">
                  <span className="field__label zdlg__label">Map colour</span>
                  <div className="zdlg__swatches" role="radiogroup" aria-label="Map colour">
                    {ZONE_COLORS.map((value) => (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={color === value}
                        aria-label={value}
                        className="zdlg__swatch"
                        style={{ background: value }}
                        onClick={() => setColor(value)}
                      />
                    ))}
                  </div>
                  <p className="field__hint">Outlines this zone on the garden map.</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* -- Live preview --------------------------------------------- */}
        <aside className="zdlg__preview" aria-live="polite">
          <h3 className="zdlg__preview-title">Zone preview</h3>
          <div className="zdlg__photo">
            <img className="zdlg__preview-photo" src={previewPhoto} alt="" />
            <input
              ref={photoRef}
              type="file"
              accept={PHOTO_ACCEPT}
              className="sr-only"
              onChange={(e) => {
                pickPhoto(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <div className="zdlg__photo-actions">
              <button
                type="button"
                className="zdlg__photo-btn"
                onClick={() => photoRef.current?.click()}
              >
                <Icon name="image" size={15} />
                {hasOwnPhoto ? "Change image" : "Upload image"}
              </button>
              {hasOwnPhoto ? (
                <button
                  type="button"
                  className="zdlg__photo-btn zdlg__photo-btn--quiet"
                  onClick={clearPhoto}
                >
                  <Icon name="trash" size={15} />
                  Remove
                </button>
              ) : null}
            </div>
            <p className="zdlg__photo-hint">
              {photoFile
                ? `${photoFile.name} — saved when you ${editingExisting ? "save changes" : "add the zone"}.`
                : "JPEG, PNG or WebP, up to 10 MB. Uses stock artwork otherwise."}
            </p>
          </div>

          <p className="zdlg__preview-name">
            <Icon name="leaf" size={19} style={{ color }} />
            {previewName}
          </p>

          <span className="zdlg__preview-flow">
            <Icon name="droplet" size={15} />
            {Number.isFinite(flowValue) && flowValue > 0 ? num(flow) : "—"} L/min
          </span>

          {previewArea ? (
            <p className="zdlg__preview-area">
              <Icon name="overview" size={15} />
              {previewArea}
            </p>
          ) : null}

          {description.trim() ? (
            <p className="zdlg__preview-area">
              <Icon name="pencil" size={15} />
              {description.trim()}
            </p>
          ) : null}

          <div className="zdlg__preview-note">
            <Icon name="info" size={15} />
            <span>
              Water consumption will be estimated based on the flow rate and your schedule.
            </span>
          </div>
        </aside>
      </div>
    </Modal>
  );
}

/** Palette offered for a zone's map outline. */
const ZONE_COLORS = ["#2f80ed", "#2e7d4f", "#a855f7", "#e0913a", "#d4483b", "#0f9b8e"];

/** Nudges the flow rate by 1 L/min, keeping it positive and tidy. */
function stepFlow(current: string, direction: 1 | -1): string {
  const parsed = Number(current);
  const base = Number.isFinite(parsed) ? parsed : 0;
  return String(Math.max(0.1, Math.round((base + direction) * 10) / 10));
}
