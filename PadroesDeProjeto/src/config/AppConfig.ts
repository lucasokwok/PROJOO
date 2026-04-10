export class AppConfig {
  private static instance: AppConfig;

  private nomeAplicacao: string;
  private servidorEnvio: string;
  private maxTentativasReenvio: number;

  private constructor() {
    this.nomeAplicacao = "Sistema de Notificações";
    this.servidorEnvio = "smtp.empresa.com";
    this.maxTentativasReenvio = 3;
  }

  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }

    return AppConfig.instance;
  }

  public getNomeAplicacao(): string {
    return this.nomeAplicacao;
  }

  public setNomeAplicacao(nomeAplicacao: string): void {
    this.nomeAplicacao = nomeAplicacao;
  }

  public getServidorEnvio(): string {
    return this.servidorEnvio;
  }

  public setServidorEnvio(servidorEnvio: string): void {
    this.servidorEnvio = servidorEnvio;
  }

  public getMaxTentativasReenvio(): number {
    return this.maxTentativasReenvio;
  }

  public setMaxTentativasReenvio(maxTentativasReenvio: number): void {
    this.maxTentativasReenvio = maxTentativasReenvio;
  }
}
