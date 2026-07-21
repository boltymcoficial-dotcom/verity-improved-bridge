const copy = {
  es: {
    eyebrow: "Puente para mundo normal",
    title: "Conecta Verity a Groq",
    lede: "Pega tu propia API key de Groq. La web crea una URL privada para tu mundo de Minecraft.",
    keyLabel: "API key de Groq",
    modelLabel: "Modelo",
    create: "Crear conexión",
    commandLabel: "Ejecuta esto en tu mundo de Minecraft:",
    copy: "Copiar comando",
    creating: "Creando conexión...",
    ready: "Conexión lista. Abre tu mundo con cheats y usa el comando.",
    copied: "Comando copiado.",
    invalid: "La key debe empezar con gsk_.",
    failed: "No se pudo crear la conexión.",
  },
  en: {
    eyebrow: "Normal world bridge",
    title: "Connect Verity to Groq",
    lede: "Paste your own Groq API key. This page creates a private URL for your Minecraft world.",
    keyLabel: "Groq API key",
    modelLabel: "Model",
    create: "Create connection",
    commandLabel: "Run this in your Minecraft world:",
    copy: "Copy command",
    creating: "Creating connection...",
    ready: "Connection ready. Open your world with cheats and run the command.",
    copied: "Command copied.",
    invalid: "The key must start with gsk_.",
    failed: "Could not create connection.",
  },
  pt: {
    eyebrow: "Ponte para mundo normal",
    title: "Conecte Verity ao Groq",
    lede: "Cole sua própria API key da Groq. A página cria uma URL privada para seu mundo Minecraft.",
    keyLabel: "API key da Groq",
    modelLabel: "Modelo",
    create: "Criar conexão",
    commandLabel: "Execute isto no seu mundo Minecraft:",
    copy: "Copiar comando",
    creating: "Criando conexão...",
    ready: "Conexão pronta. Abra o mundo com cheats e use o comando.",
    copied: "Comando copiado.",
    invalid: "A key deve começar com gsk_.",
    failed: "Não foi possível criar a conexão.",
  },
  fr: {
    eyebrow: "Pont pour monde normal",
    title: "Connecter Verity à Groq",
    lede: "Collez votre propre clé API Groq. Cette page crée une URL privée pour votre monde Minecraft.",
    keyLabel: "Clé API Groq",
    modelLabel: "Modèle",
    create: "Créer la connexion",
    commandLabel: "Exécutez ceci dans votre monde Minecraft :",
    copy: "Copier la commande",
    creating: "Création de la connexion...",
    ready: "Connexion prête. Ouvrez votre monde avec les cheats et lancez la commande.",
    copied: "Commande copiée.",
    invalid: "La clé doit commencer par gsk_.",
    failed: "Impossible de créer la connexion.",
  },
  de: {
    eyebrow: "Bridge für normale Welten",
    title: "Verity mit Groq verbinden",
    lede: "Füge deinen eigenen Groq API-Key ein. Diese Seite erstellt eine private URL für deine Minecraft-Welt.",
    keyLabel: "Groq API-Key",
    modelLabel: "Modell",
    create: "Verbindung erstellen",
    commandLabel: "Führe das in deiner Minecraft-Welt aus:",
    copy: "Befehl kopieren",
    creating: "Verbindung wird erstellt...",
    ready: "Verbindung bereit. Öffne deine Welt mit Cheats und nutze den Befehl.",
    copied: "Befehl kopiert.",
    invalid: "Der Key muss mit gsk_ beginnen.",
    failed: "Verbindung konnte nicht erstellt werden.",
  },
};

const language = document.querySelector("#language");
const statusEl = document.querySelector("#status");
const result = document.querySelector("#result");
const commandEl = document.querySelector("#command");

function t(key) {
  return copy[language.value]?.[key] || copy.en[key] || key;
}

function applyLanguage() {
  document.documentElement.lang = language.value;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
}

function setStatus(message, kind = "") {
  statusEl.textContent = message;
  statusEl.className = `status ${kind}`;
}

language.addEventListener("change", applyLanguage);
applyLanguage();

document.querySelector("#create").addEventListener("click", async () => {
  const groqApiKey = document.querySelector("#groqKey").value.trim();
  const model = document.querySelector("#model").value.trim() || "llama-3.1-8b-instant";
  result.classList.add("hidden");
  if (!groqApiKey.startsWith("gsk_")) {
    setStatus(t("invalid"), "error");
    return;
  }
  setStatus(t("creating"));
  try {
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ groqApiKey, model }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || "failed");
    commandEl.textContent = data.command;
    result.classList.remove("hidden");
    setStatus(t("ready"), "ok");
    document.querySelector("#groqKey").value = "";
  } catch {
    setStatus(t("failed"), "error");
  }
});

document.querySelector("#copy").addEventListener("click", async () => {
  await navigator.clipboard.writeText(commandEl.textContent);
  setStatus(t("copied"), "ok");
});
