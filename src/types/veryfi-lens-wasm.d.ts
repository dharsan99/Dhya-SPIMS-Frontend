// src/types/veryfi-lens-wasm.d.ts
declare module 'veryfi-lens-wasm' {
  interface VeryfiLensInitOptions {
    lensFlavor?: 'document' | 'receipt' | 'long_receipt' | 'check' | 'credit_card';
    docValidation?: boolean;
    blurModal?: boolean;
    isDocumentModal?: boolean;
    torchButton?: boolean;
    exitButton?: boolean;
  }

  interface VeryfiLensResult {
    image: {
      uri: string;
    };
    data: any; // The structured extracted data
  }

  interface VeryfiLens {
    open(arg0: { client_id: any; api_key: any; username: any; document_type: string; boost_mode: boolean; onSuccess: (structured: any) => void; onError: (err: any) => void; }): unknown;
    init(clientId: string, options: VeryfiLensInitOptions): Promise<void>;
    showCamera(callback?: (image: string) => void): void;
    onSuccess(callback: (result: VeryfiLensResult) => void): void;
    onFailure(callback: (error: any) => void): void;
    onUpdate(callback: (status: { status: string }) => void): void;
  }

  const VeryfiLens: VeryfiLens;
  export default VeryfiLens;
}