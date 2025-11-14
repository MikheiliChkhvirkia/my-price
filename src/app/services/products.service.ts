import { inject, Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { StoreEvent, StoreData, Product } from "../interfaces/home-products.interface";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private abortController?: AbortController;

  getProductsStream(): Observable<StoreEvent> {
    const subject = new Subject<StoreEvent>();

    // Cancel existing request if any
    this.abortController?.abort();

    // Create new AbortController for this request
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    const streamUrl = 'https://chemifasi.runasp.net/stream';

    // Use fetch API for better control and CORS handling
    fetch(streamUrl, {
      signal,
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache'
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        if (!reader) {
          throw new Error('Response body is not readable');
        }

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            subject.complete();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;

            try {
              let jsonData = trimmedLine;

              // Handle SSE format (data: {...})
              if (trimmedLine.startsWith('data: ')) {
                jsonData = trimmedLine.substring(6).trim();
              }
              
              // Try to parse as JSON
              if (jsonData && (jsonData.startsWith('{') || jsonData.startsWith('['))) {
                const data: StoreData = JSON.parse(jsonData);
                const storeEvent: StoreEvent = {
                  event: 'store',
                  data: data
                };
                subject.next(storeEvent);
              }
            } catch (error) {
              // If it's not valid JSON, it might be a partial chunk - continue
              // Only log if it looks like it should be JSON
              if (trimmedLine.startsWith('{') || trimmedLine.startsWith('[')) {
                console.warn('Failed to parse JSON line:', trimmedLine.substring(0, 100));
              }
            }
          }
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Stream error:', error);
          subject.error(error);
        }
      });

    return new Observable(observer => {
      const subscription = subject.subscribe(observer);
      return () => {
        subscription.unsubscribe();
        this.abortController?.abort();
        this.abortController = undefined;
      };
    });
  }

  getAllProducts(): Observable<Product[]> {
    const allProducts: Product[] = [];
    
    return new Observable(observer => {
      const streamSubscription = this.getProductsStream().subscribe({
        next: (storeEvent: StoreEvent) => {
          if (storeEvent.data?.products) {
            allProducts.push(...storeEvent.data.products);
            // Emit accumulated products so far
            observer.next([...allProducts]);
          }
        },
        error: (error) => {
          observer.error(error);
        },
        complete: () => {
          observer.complete();
        }
      });

      return () => {
        streamSubscription.unsubscribe();
      };
    });
  }

  closeStream(): void {
    this.abortController?.abort();
    this.abortController = undefined;
  }
}